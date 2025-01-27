const Follower = require('../models/Follower')
const User = require('../models/User')

const follow_request = async (req, res) => {

    const id = req.cookies._id
    const following_id = req.params.following_id

    const followingUser = await User.findById(following_id, '-password')

    if (!followingUser) {
        return res.status(400).json({ "error": 1, "msg": "No such user with that ID" })
    }
    else {
        const following = await Follower.findOne({ sent: id, received: following_id })
        if (!following) {
            try {
                await Follower.create({ sent: id, received: following_id })
                return res.status(200).json({ "error": 0 })
            }
            catch (error) {
                console.log(error)
                return res.status(500).json({ "error": 1, "msg": "Error while trying to send follow request" })
            }
        }
        else {
            return res.status(400).json({ "error": 1, "msg": "Waiting for confirmation" })
        }
    }

}

const follow_received = async (req, res) => {

    const id = req.cookies._id

    const recebidas = await Follower.find({ pending: true, received: id }).select('-password').populate('sent').select('-password')
    return res.status(200).json(recebidas)

}

const follow_sent = async (req, res) => {

    const id = req.cookies._id

    const enviadas = await Follower.find({ pending: true, sent: id }).select('-password').populate('received').select('-password')
    return res.status(200).json(enviadas)

}

const follow_accept = async (req, res) => {

    const id = req.cookies._id
    const follow_id = req.params.id

    const follow = await Follower.findById({ _id: follow_id })
    if (follow) {
        follow.pending = false
        follow.save()
        res.status(200).json({ "_id": follow_id })
    }
    else {
        res.status(500).json({ "error": 1 })
    }

}

const following_me = async (req, res) => {

    const id = req.cookies._id
    const followed = await Follower.find({ received: id, pending: false }).populate('sent')
    res.status(500).json({ "error": 0, followed })

}

const im_following = async (req, res) => {

    const id = req.cookies._id
    const following = await Follower.find({ sent: id, pending: false }).populate('received')
    res.status(500).json({ "error": 0, following })

}

const search_friends = async (req, res) => {

    const id = req.cookies._id
    const follows = await Follower.find({ $or: [{ sent: id }, { received: id }] }).where('pending').eq(false)

    let ids = []
    follows.forEach(follow => {
        if (follow.sent == id && follow.received != id) {
            if (!ids.includes(follow.received)) {
                ids.push(follow.received)
            }
        }
        else if (follow.sent != id && follow.received == id) {
            if (!ids.includes(follow.sent)) {
                ids.push(follow.sent)
            }
        }
    })
    const users = await User.find({ nome: new RegExp(req.params.pesquisa, 'i'), _id: { $in: ids } }).limit(10)

    if (users) {
        res.status(200).json({ "error": 0, users })
    }
    else {
        res.status(500).json({ "error": 1 })
    }

}

const list_friends = async (req, res) => {

    const id = req.cookies._id
    const user = await User.findById(id).select('apelido')

    const follows = await Follower.find({ $or: [{ sent: id }, { received: id }] }).where('pending').eq(false)

    let ids = []
    follows.forEach(follow => {
        if (follow.sent == id && follow.received != id) {
            if (!ids.includes(follow.received)) {
                ids.push(follow.received)
            }
        }
        else if (follow.sent != id && follow.received == id) {
            if (!ids.includes(follow.sent)) {
                ids.push(follow.sent)
            }
        }
    })
    const users = await User.find({ _id: { $in: ids } }).select('nome apelido avatar')

    if (users) {
        res.status(200).json({ "error": 0, users, user })
    }
    else {
        res.status(500).json({ "error": 1 })
    }

}

module.exports = {
    follow_request,
    follow_received,
    follow_sent,
    follow_accept,
    following_me,
    im_following,
    search_friends,
    list_friends
}