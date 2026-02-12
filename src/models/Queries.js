/* Plugins. */
import mongoose from "mongoose";

const queriesSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        trim: true
    },

    message: {
        type: String,
        requird: true,
        trim: true
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

const Queries = mongoose.models.Queries || mongoose.model('Queries', queriesSchema, 'Queries');
export default Queries;