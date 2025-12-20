const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true
    },
    subtitle: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        required: [true, 'Please add an image URL']
    },
    link: {
        type: String,
        default: '/'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Hero', heroSchema);
