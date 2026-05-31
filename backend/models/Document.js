const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true,
        trim: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    rawText: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        default: ''
    },
    extractedInsights: [{
        type: String
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, {
    // Automatically handles createdAt and updatedAt Date fields natively
    timestamps: true
});

module.exports = mongoose.model('Document', DocumentSchema);