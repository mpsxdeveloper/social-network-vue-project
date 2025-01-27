const mongoose = require('mongoose')
const User = require('./User')

const Publication = new mongoose.model('Publication', new mongoose.Schema({

    url: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    likes: {
        type: Number,
        required: true,
        default: 0
    },
    comments: {
        type: Number,
        required: true,
        default: 0
    }

}))

module.exports = Publication