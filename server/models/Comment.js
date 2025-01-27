const mongoose = require('mongoose')
const User = require('../models/User')
const Publication = require('../models/Publication')

const Comment = new mongoose.model('Comment', new mongoose.Schema({

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    publication_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Publication,
        required: true
    },
    comment: {
        type: String,
        required: true,
        maxlength: 200
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }

}))

module.exports = Comment