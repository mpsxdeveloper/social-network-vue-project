const Publication = require('../models/Publication')
const User = require('../models/User')
const Follower = require('../models/Follower')
const Like = require('../models/Like')
const Comment = require('../models/Comment')

const post_publication = async (req, res) => {

    if (req.file) {
        const id = req.cookies._id
        const user = await User.findById(id, '-password')
        if (!user) {
            res.status(400).json({ "error": 1 })
            return
        }
        else {
            const publication = await Publication.create({ url: req.file.filename, user_id: user._id })
            if (publication) {
                res.status(200).json({ publication, "error": 0 })
                return
            }
            else {
                res.status(400).json({ "error": 1 })
                return
            }
        }
    }
    else {
        res.status(400).json({ "error": 1 })
    }

}

const list_publications = async (req, res) => {

    const _id = req.cookies._id
    const following = await Follower.find({ pending: false, sent: _id }).select('received')
    let ids = []
    following.forEach(user => {
        ids.push(user.received)
    })

    const publications = await Publication.find({ user_id: { $in: ids } }).sort({ date: 'desc' }).populate('user_id').limit(15)

    let pids = []
    publications.forEach(publication => {
        pids.push(publication._id)
    })

    const likes = await Like.find({ user_id: _id, publication_id: { $in: pids } }).where('liked').eq(true)
    let commentsperpublication
    let comments = []
    for (let i = 0; i < pids.length; i++) {
        commentsperpublication = await Comment.find({ publication_id: pids[i] }).sort({ data: 'desc' }).populate('user_id').select('-password').limit(2)
        commentsperpublication.forEach(c => {
            comments.push(c)
        })
    }

    res.status(200).json({ publications, likes, comments, userID: _id })

}

const list_mypublications = async (req, res) => {

    const _id = req.cookies._id
    const publications = await Publication.find({ user_id: _id }).sort({ date: 'desc' })

    let pids = []
    publications.forEach(publication => {
        pids.push(publication._id)
    })

    const likes = await Like.find({ publication_id: { $in: pids } }).where('liked').eq(true)

    let commentsperpublication
    let comments = []
    for (let i = 0; i < pids.length; i++) {
        commentsperpublication = await Comment.find({ publication_id: pids[i] }).sort({ data: 'desc' }).populate('user_id').select('-password').limit(2)
        commentsperpublication.forEach(c => {
            comments.push(c)
        })
    }

    res.status(200).json({ publications, likes, comments, userID: _id })

}

const delete_comment = async (req, res) => {

    const _id = req.cookies._id
    const comment_id = req.params.comment_id
    const publication_id = req.params.publication_id

    const comment = await Comment.findById({ _id: comment_id })
    if (comment) {
        const publication = await Publication.findOne({ _id: publication_id })
        if (publication) {
            publication.comments = publication.comments - 1
            publication.save()
            const deleted = await comment.deleteOne({ _id: comment_id })
            res.status(200).json({ error: 0, deleted })
        }
    }
    else {
        res.status(500).json({ error: 1 })
    }

}

module.exports = {
    post_publication,
    list_publications,
    delete_comment,
    list_mypublications
}