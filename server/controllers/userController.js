const User = require('../models/User')
const Follower = require('../models/Follower')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const register = async (req, res) => {

    const { nome, apelido, email, senha } = req.body

    const userExists = await User.findOne({ email: email })
    if (userExists) {
        res.status(422).json({ "error": 1, "msg": "E-mail já está sendo utilizado" })
        return
    }

    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(senha, salt)

    try {
        const user = new User({ nome, apelido, email, password: passwordHash })
        await user.save()
        res.status(200).json({ "error": 0, "msg": "Registro realizado com sucesso" })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ "error": 1, "msg": "Ocorreu algum erro no servidor, tente outra vez mais tarde" })
    }

}

const login = async (req, res) => {

    const { email, senha } = req.body
    try {
        const user = await User.findOne({ email: email })

        if (!user) {
            res.status(500).json({ "error": 1, "msg": "E-mail e/ou senha incorretos" })
            return
        }
        else {
            const checkPassword = await bcrypt.compare(senha, user.password)
            if (!checkPassword) {
                res.status(500).json({ "error": 1, "msg": "E-mail e/ou senha incorretos" })
                return
            }
            else {
                try {
                    const secret = process.env.SECRET
                    const token = jwt.sign(
                        {
                            id: user._id
                        },
                        secret
                    )
                    res.cookie('_id', user._id, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true })
                    res.cookie('_token', token, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true })
                    res.status(200).json({ "error": 0, "msg": "Login feito com sucesso" })
                }
                catch (error) {
                    console.log(error)
                }
            }
        }
    }
    catch (error) {
        console.log(error)
    }

}

const home = async (req, res) => {

    const id = req.cookies._id
    const user = await User.findById(id, '-password')
    if (!user) {
        res.status(403).json({ "msg": "rota proibida" })
    }
    else {
        const users = await User.find({ '_id': { $ne: id } }).select('_id').limit(10)
        let ids = []
        users.forEach(user => {
            ids.push(user._id)
        })
        for (let i = 0; i < ids.length; i++) {
            let sender = await Follower.find({ sent: ids[i], received: id })
            if (sender.length === 0) {
                let receiver = await Follower.find({ $or: [{ received: ids[i], sent: id }] })
                if (receiver.length === 0) {
                }
                else {
                }
            }
        }

        const suggestions = []

        for (let i = 0; i < ids.length; i++) {
            const user = await User.find({ _id: ids[i] })
            suggestions.push[user]
        }
        res.status(200).json({ "msg": "ok", user, suggestions })

    }

}

const update_picture = async (req, res) => {

    if (req.file) {
        await sharp(req.file.path).resize(100, 100).toFormat('jpeg').toFile(`./public/avatars/${req.file.filename}`)
        const id = req.cookies._id
        const user = await User.findById(id, '-password')
        if (user.avatar !== 'default.jpg') {
            fs.unlink(path.resolve('./public/avatars/' + user.avatar), (err) => {
                console.log(err)
            })
        }
        user.avatar = req.file.filename
        user.save()
        fs.unlink(path.resolve('./tmp/' + req.file.filename), (err) => {
            console.log(err)
        })
        res.status(200).json({ "error": 0, "avatar": user.avatar })
    }
    else {
        res.status(400).json({ "error": 1 })
    }

}

const get_avatar = async (req, res) => {

    const id = req.cookies._id
    const user = await User.findById(id, '-password').select('avatar')
    const avatar = user.avatar
    res.status(200).json({ avatar })

}

const logout = (req, res) => {
    try {
        res.cookie('_id', '', { maxAge: 1, httpOnly: true })
        res.cookie('_token', '', { maxAge: 1, httpOnly: true })
        res.status(200).json({ "error": 0 })
    }
    catch (error) {
        console.log(error)
        res.status(400).json({ "error": 1 })
    }

}

module.exports = {
    login,
    register,
    home,
    update_picture,
    get_avatar,
    logout
}