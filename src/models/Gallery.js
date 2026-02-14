const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema({

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

const Gallery = mongoose.models.Gallery || mongoose.model('Gallery', gallerySchema, 'Gallery');
export default Gallery;