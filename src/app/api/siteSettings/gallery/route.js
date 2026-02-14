/* Plugins. */
import { NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import fs from "fs";
import crypto from "crypto";

/* Model. */
import Gallery from "@/models/Gallery";

export async function GET(req) {
    try {
        const images = await Gallery.find().sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            images: images
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching gallery images:', error);
        return NextResponse.json({
            success: false,
            message: `Failed to fetch images. Error: ${error.message}`
        }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const formData = await req.formData();
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'gallery');

        await mkdir(uploadDir, { recursive: true });

        const images = formData.getAll('images');
        const uploadedImages = [];

        if (!images || images.length === 0) {
            return NextResponse.json({
                success: false,
                message: 'No images provided'
            }, { status: 400 });
        }

        for (const image of images) {
            if (image && image instanceof File && image.size > 0) {
                // Validate file type
                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
                if (!allowedTypes.includes(image.type)) {
                    continue;
                }

                // Validate file size (10MB)
                if (image.size > 10 * 1024 * 1024) {
                    continue;
                }

                const bytes = await image.arrayBuffer();
                const buffer = Buffer.from(bytes);

                // Generate crypto filename
                const sanitizedFilename = image.name.toLowerCase().replace(/\s+/g, '');
                const fileExtension = path.extname(sanitizedFilename);
                const randomName = crypto.randomBytes(16).toString('hex');
                const fileName = `${randomName}${fileExtension}`;
                const filePath = path.join(uploadDir, fileName);

                // Write file
                await writeFile(filePath, buffer);

                // Save to database
                const galleryImage = await Gallery.create({
                    image: fileName,
                    createdAt: new Date()
                });

                uploadedImages.push({
                    id: galleryImage._id,
                    image: fileName
                });
            }
        }

        if (uploadedImages.length === 0) {
            return NextResponse.json({
                success: false,
                message: 'No valid images uploaded'
            }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            message: `${uploadedImages.length} image(s) uploaded successfully`,
            images: uploadedImages
        }, { status: 200 });

    } catch (error) {
        console.error('Error in gallery upload API:', error);
        return NextResponse.json({
            success: false,
            message: `Failed to upload images. Error: ${error.message}`
        }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const imageId = searchParams.get('id');

        if (!imageId) {
            return NextResponse.json({
                success: false,
                message: 'Image ID is required'
            }, { status: 400 });
        }

        // Find image in database
        const galleryImage = await Gallery.findById(imageId);

        if (!galleryImage) {
            return NextResponse.json({
                success: false,
                message: 'Image not found in database'
            }, { status: 404 });
        }

        // Delete file from directory
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'gallery');
        const filePath = path.join(uploadDir, galleryImage.image);

        if (fs.existsSync(filePath)) {
            await unlink(filePath).catch(err => {
                console.error('Error deleting file:', err);
            });
        }

        // Delete from database
        await Gallery.findByIdAndDelete(imageId);

        return NextResponse.json({
            success: true,
            message: 'Image deleted successfully'
        }, { status: 200 });

    } catch (error) {
        console.error('Error in gallery delete API:', error);
        return NextResponse.json({
            success: false,
            message: `Failed to delete image. Error: ${error.message}`
        }, { status: 500 });
    }
}