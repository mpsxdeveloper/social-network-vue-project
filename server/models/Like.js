const mongoose = require('mongoose')
const User = require('../models/User')
const Publication = require('../models/Publication')

const Like = new mongoose.model('Like', new mongoose.Schema({

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
    liked: {
        type: Boolean,
        required: true,
        default: true
    }

}))

module.exports = Like