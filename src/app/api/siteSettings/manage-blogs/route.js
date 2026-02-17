/* Plugins. */
import { NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import fs from "fs";

/* Database connection. */

/* Models. */
import dbConnect from "@/lib/db";
import Blog from "@/models/Blogs";
import BlogImages from "@/models/BlogImages";

export async function POST(req) {
    try {
        await dbConnect();

        const formData = await req.formData();
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'blogs');

        await mkdir(uploadDir, { recursive: true });

        const blogsData = [];
        let blogIndex = 0;

        /* Parse all blogs from formData */
        while (formData.has(`blogs[${blogIndex}][header]`)) {
            const _id = formData.get(`blogs[${blogIndex}][_id]`);
            const header = formData.get(`blogs[${blogIndex}][header]`);
            const description = formData.get(`blogs[${blogIndex}][description]`);
            const date = formData.get(`blogs[${blogIndex}][date]`);
            const time = formData.get(`blogs[${blogIndex}][time]`);

            if (header && description && date && time) {
                blogsData.push({
                    _id: _id || null,
                    header,
                    description,
                    date: new Date(date),
                    time,
                    formDataIndex: blogIndex
                });
            }

            blogIndex++;
        }

        const savedBlogs = [];

        for (const blogData of blogsData) {

            let blogDoc;

            /* UPDATE existing blog if _id provided, else CREATE new */
            if (blogData._id && blogData._id !== '') {
                blogDoc = await Blog.findByIdAndUpdate(
                    blogData._id,
                    {
                        header: blogData.header,
                        description: blogData.description,
                        date: blogData.date,
                        time: blogData.time,
                        updatedAt: new Date()
                    },
                    { new: true }
                );

                /* If blog not found by _id, create new */
                if (!blogDoc) {
                    blogDoc = await Blog.create({
                        header: blogData.header,
                        description: blogData.description,
                        date: blogData.date,
                        time: blogData.time,
                        createdAt: new Date()
                    });
                }
            } else {
                /* Create new blog */
                blogDoc = await Blog.create({
                    header: blogData.header,
                    description: blogData.description,
                    date: blogData.date,
                    time: blogData.time,
                    createdAt: new Date()
                });
            }

            /* Handle existing images - keep track of what's retained */
            const existingImageKeys = [];
            let existingImgIndex = 0;

            while (formData.has(`blogs[${blogData.formDataIndex}][existingImages][${existingImgIndex}]`)) {
                const imageName = formData.get(`blogs[${blogData.formDataIndex}][existingImages][${existingImgIndex}]`);
                if (imageName) existingImageKeys.push(imageName);
                existingImgIndex++;
            }

            /* If existing blog, delete images that were removed by user */
            if (blogData._id && blogData._id !== '') {
                const allExistingImages = await BlogImages.find({ blogId: blogDoc._id });

                for (const imgDoc of allExistingImages) {
                    if (!existingImageKeys.includes(imgDoc.image)) {
                        /* Delete file from disk */
                        const imagePath = path.join(uploadDir, imgDoc.image);
                        if (fs.existsSync(imagePath)) {
                            await unlink(imagePath).catch(err => console.error('Error deleting file:', err));
                        }
                        /* Delete from DB */
                        await BlogImages.findByIdAndDelete(imgDoc._id);
                    }
                }
            }

            /* Handle NEW image uploads - getAll fixes the duplicate issue */
            const newImageFiles = formData.getAll(`blogs[${blogData.formDataIndex}][images]`);

            console.log(`Blog ${blogData.formDataIndex} - new image files found:`, newImageFiles.length);

            const savedImages = [];

            for (const file of newImageFiles) {
                if (file && file instanceof File && file.size > 0) {
                    const bytes = await file.arrayBuffer();
                    const buffer = Buffer.from(bytes);

                    const timestamp = Date.now();
                    const randomSuffix = Math.floor(Math.random() * 10000);
                    const fileExtension = file.name.split('.').pop();
                    const fileName = `blog_${blogDoc._id}_${timestamp}_${randomSuffix}.${fileExtension}`;
                    const filePath = path.join(uploadDir, fileName);

                    await writeFile(filePath, buffer);

                    /* Save image reference in BlogImages collection */
                    const blogImage = await BlogImages.create({
                        blogId: blogDoc._id,
                        image: fileName,
                        createdAt: new Date()
                    });

                    console.log('Saved blog image:', blogImage);
                    savedImages.push(blogImage);
                }
            }

            savedBlogs.push({
                blog: blogDoc,
                images: savedImages
            });
        }

        return NextResponse.json({
            success: true,
            message: `${savedBlogs.length} blog(s) saved successfully`,
            blogs: savedBlogs
        }, { status: 200 });

    } catch (error) {
        console.error('Error in manageBlogs POST:', error);
        return NextResponse.json({
            success: false,
            message: `Something went wrong in managing blogs data. Error: ${error.message}`
        }, { status: 400 });
    }
}

export async function GET() {
    try {
        await dbConnect();

        // Fetch all blogs
        const blogs = await Blog.find({}).sort({ createdAt: -1 }).lean();

        // Fetch images for each blog
        const blogsWithImages = await Promise.all(
            blogs.map(async (blog) => {
                const images = await BlogImages.find({ blogId: blog._id }).lean();
                return {
                    ...blog,
                    images: images
                };
            })
        );

        return NextResponse.json({
            success: true,
            blogs: blogsWithImages
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching blogs:', error);
        return NextResponse.json({
            success: false,
            message: `Error fetching blogs data: ${error.message}`
        }, { status: 400 });
    }
}

export async function DELETE(req) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const blogId = searchParams.get('id');

        if (!blogId) {
            return NextResponse.json({
                success: false,
                message: 'Blog ID is required'
            }, { status: 400 });
        }

        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'blogs');

        // Find and delete all images associated with this blog
        const blogImages = await BlogImages.find({ blogId });

        for (const imageDoc of blogImages) {
            const imagePath = path.join(uploadDir, imageDoc.image);
            if (fs.existsSync(imagePath)) {
                await unlink(imagePath).catch(err => console.error('Error deleting file:', err));
            }
        }

        // Delete image records from database
        await BlogImages.deleteMany({ blogId });

        // Delete the blog
        await Blog.findByIdAndDelete(blogId);

        return NextResponse.json({
            success: true,
            message: 'Blog deleted successfully'
        }, { status: 200 });

    } catch (error) {
        console.error('Error deleting blog:', error);
        return NextResponse.json({
            success: false,
            message: `Error deleting blog: ${error.message}`
        }, { status: 400 });
    }
}