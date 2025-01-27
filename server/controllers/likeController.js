const Publication = require('../models/Publication')
const User = require('../models/User')
const Like = require('../models/Like')

const give_like = async (req, res) => {

    const _id = req.cookies._id
    const publication_id = req.params.publication_id

    const like = await Like.findOne({ publication_id, user_id: _id })
    if (!like) {
        const newLike = await Like.create({ user_id: _id, publication_id })
        const publication = await Publication.findById({ _id: publication_id })
        publication.likes = publication.likes + 1
        publication.save()
        res.status(200).json({ "error": 0, "liked": newLike.liked })
    }
    else {
        const updateLike = await Like.findOne({ user_id: _id, publication_id })
        updateLike.liked = !updateLike.liked
        updateLike.save()
        const updatePublication = await Publication.findOne({ _id: publication_id })
        if (updateLike.liked) {
            updatePublication.likes = updatePublication.likes + 1
        }
        else {
            updatePublication.likes = updatePublication.likes - 1
        }
        updatePublication.save()
        res.status(400).json({ "error": 0, "liked": updateLike.liked })
    }

}

module.exports = {
    give_like
}