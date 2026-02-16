/* Plugins. */
import mongoose from "mongoose";

const blogImagesSchema = new mongoose.Schema({

    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    image: {
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

const BlogImages = mongoose.models.BlogImages || mongoose.model('BlogImages', blogImagesSchema, 'BlogImages');
export default BlogImages;