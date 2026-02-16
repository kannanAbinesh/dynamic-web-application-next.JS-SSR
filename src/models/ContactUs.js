/* Plugins. */
import mongoose from "mongoose";

const contactUsSchema = new mongoose.Schema({

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

const ContactUs = mongoose.models.ContactUs || mongoose.model('ContactUs', contactUsSchema, 'ContactUs');
export default ContactUs;