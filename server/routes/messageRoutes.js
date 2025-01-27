const express = require('express')
const messageController = require('../controllers/messageController')

const messageRouter = express.Router()

messageRouter.post('/server/message/send', messageController.send_message)
messageRouter.post('/server/message/list', messageController.list_messages)

module.exports = {
    messageRouter
}