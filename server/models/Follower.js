const mongoose = require('mongoose')
const User = require('./User')

const Follower = new mongoose.model('Follower', new mongoose.Schema({

    sent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    received: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    pending: {
        type: mongoose.Schema.Types.Boolean,
        required: true,
        default: true
    }

}))

module.exports = Follower