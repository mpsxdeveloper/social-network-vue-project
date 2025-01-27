const express = require('express')
const followerController = require('../controllers/followerController')

const followerRouter = express.Router()

followerRouter.get('/server/follow/received', followerController.follow_received)
followerRouter.get('/server/follow/sent', followerController.follow_sent)
followerRouter.get('/server/follow/:following_id', followerController.follow_request)
followerRouter.get('/server/follow/accept/:id', followerController.follow_accept)
followerRouter.get('/server/profile/followed', followerController.following_me)
followerRouter.get('/server/profile/following', followerController.im_following)
followerRouter.get('/server/chat/pesquisa/:pesquisa', followerController.search_friends)
followerRouter.get('/server/friends/list', followerController.list_friends)

module.exports = {
    followerRouter
}