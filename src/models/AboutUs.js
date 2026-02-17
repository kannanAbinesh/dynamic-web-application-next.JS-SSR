/* Plugins. */
import mongoose from "mongoose";

const aboutUsSchema = new mongoose.Schema({

    key: {
        type: String,
        default: true
    },

    value: {
        type: String,
        default: true
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

const AboutUs = mongoose.models.AboutUs || mongoose.model('AboutUs', aboutUsSchema, 'AboutUs');
export default AboutUs;