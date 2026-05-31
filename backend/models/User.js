const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name identifier is required.']
    },
    email: {
        type: String,
        required: [true, 'Email field is required.'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Secure credential hash is required.'],
        minlength: 6
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);