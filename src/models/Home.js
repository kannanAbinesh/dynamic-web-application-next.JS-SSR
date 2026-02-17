/* Plugins. */
import mongoose from "mongoose";

const homeSchema = new mongoose.Schema({

    key: {
        type: String,
        required: true
    },

    value: {
        type: String,
        default: ''
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

const Home = mongoose.models.Home || mongoose.model('Home', homeSchema, 'Home');
export default Home;