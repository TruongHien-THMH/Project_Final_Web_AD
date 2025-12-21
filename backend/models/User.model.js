const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true, // Email không được trùng
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6 // Pass ít nhất 6 ký tự
    },
    phone: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    avatar: {
        type: String,
        default: "" 
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;