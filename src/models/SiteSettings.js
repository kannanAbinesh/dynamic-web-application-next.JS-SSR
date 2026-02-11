/* Plugins. */
const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({

    key: {
        type: String,
        required: [true, 'Key is required']
    },

    value: {
        type: String,
        required: [true, 'Value is required']
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

const SiteSetting = mongoose.models.SiteSetting || mongoose.model('SiteSetting', siteSettingsSchema, 'SiteSetting');
module.exports = SiteSetting;