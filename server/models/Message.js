const mongoose = require('mongoose')
const User = require('./User')

const Message = new mongoose.model('Message', new mongoose.Schema({

    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    receiver_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        default: 'chat'
    },
    data: {
        type: Date,
        required: true,
        default: Date.now
    }

}))

module.exports = Message