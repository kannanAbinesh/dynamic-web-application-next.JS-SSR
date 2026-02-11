/* Plugins. */
import mongoose from "mongoose";

const loginSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    token: {
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

const Login = mongoose.models.Login || mongoose.model('Login', loginSchema, 'Login');
export default Login;