const Comment = require("../models/Comment");
const Publication = require("../models/Publication");

const make_comment = async (req, res) => {
    const _id = req.cookies._id;
    const { publication_id, comment } = req.body;

    const newComment = await Comment.create({
        user_id: _id,
        publication_id,
        comment,
    });
    const publication = await Publication.findById(publication_id);

    if (comment) {
        publication.comments = publication.comments + 1;
        publication.save();
        commentSaved = await Comment.findById(newComment._id)
            .populate("user_id")
            .select("-password");
        res.status(200).json({ error: 0, comment: commentSaved });
    } else {
        res.status(400).json({ error: 0, msg: "no comments" });
    }
};

module.exports = {
    make_comment,
};
