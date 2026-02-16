import ManageBlogs from "@/components/ManageBlogs/ManageBlogs";
import dbConnect from "@/lib/db";
import Blog from "@/models/Blogs";

export default async function ManageBlogsIndex() {
    let blogsData = [];

    try {
        await dbConnect();

        const rawBlogs = await Blog.aggregate([
            {
                $sort: { createdAt: -1 },
            },
            {
                $lookup: {
                    from: "blogimages", // MongoDB collection names are lowercase by default
                    localField: "_id",
                    foreignField: "blogId",
                    as: "images",
                },
            },
        ]);

        // Serialize the data properly for client component
        blogsData = JSON.parse(JSON.stringify(rawBlogs.map(blog => ({
            _id: blog._id.toString(),
            header: blog.header,
            description: blog.description,
            date: blog.date, // Will be serialized as string
            time: blog.time,
            createdAt: blog.createdAt,
            updatedAt: blog.updatedAt,
            images: blog.images.map(img => ({
                _id: img._id.toString(),
                blogId: img.blogId.toString(),
                image: img.image,
                createdAt: img.createdAt,
            }))
        }))));

    } catch (error) {
        console.error("Error fetching blogs data:", error);
    }

    return (
        <div>
            <ManageBlogs initialBlogs={blogsData} />
        </div>
    );
};