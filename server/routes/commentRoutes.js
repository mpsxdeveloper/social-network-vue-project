const express = require('express')
const commentController = require('../controllers/commentController')

const commentRouter = express.Router()

commentRouter.post('/server/comment', commentController.make_comment)

module.exports = {
    commentRouter
}