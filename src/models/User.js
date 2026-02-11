/* Plugins. */
import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/* Variables. */
const jwtAccessToken = process.env.ACCESS_TOKEN;

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        trim: true, 
        unique: true
    },

    password: {
        type: String,
        required: true,
        trim: true
    },

    phoneNumber: {
        type: String,
        required: false,
        default: null
    },

    role: {
        type: String,
        enum: ['superAdmin', 'admin', 'user'],
        default: 'user'
    },

    status: {
        type: String,
        enum: ['active', 'inActive'],
        default: 'active'
    },

    notificationSubscription: {
        type: [Object],
        default: []
    },

    resetPasswordToken: {
        type: String,
        default: null
    },

    resetPasswordExpires: {
        type: Date,
        default: null
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
        default: null
    },

    deletedAt: {
        type: Date,
        default: null
    }

}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) { next({ error }) };
});

/* Functionality to check the password matches with the entered password. */
userSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

/* Functionaity to JWT token. so users can access API only if the token is valid. */
userSchema.methods.generateAuthToken = function () {
    let token = jwt.sign({
        _id: this._id,
        role: this.role,
        name: this.name,
        email: this.email,
    }, jwtAccessToken, { expiresIn: '3d' });
    return token;
};

const User = mongoose.models.User || mongoose.model('User', userSchema, 'User');
export default User;