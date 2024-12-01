const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    editor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Editor',
        required: true
    },
    video_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video',
        required: true
    },
    owner_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Owner',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'completed'],
        default: 'pending'
    }
}, {
    timestamps: true
});

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;