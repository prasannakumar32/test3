const mongoose = require('mongoose');

const storageSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    environment: {
        type: String,
        enum: ['production', 'consumption'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
storageSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Storage', storageSchema);
