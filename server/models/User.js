const mongoose = require('mongoose')

const User = new mongoose.model('User', new mongoose.Schema({

    nome: {
        type: String,
        required: true
    },
    apelido: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    avatar: {
        type: String,
        required: true,
        default: 'default.jpg'
    }

}))

module.exports = User