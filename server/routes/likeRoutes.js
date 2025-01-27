const express = require('express')
const likeController = require('../controllers/likeController')

const likeRouter = express.Router()

likeRouter.get('/server/like/:publication_id', likeController.give_like)

module.exports = {
    likeRouter
}