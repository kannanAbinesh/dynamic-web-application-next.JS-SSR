/* Plugins. */
import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    header: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: null
    }
});

const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema, 'Blog');
export default Blog;