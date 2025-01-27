const Message = require('../models/Message')

const send_message = async (req, res) => {

    const _id = req.cookies._id
    const { message, receiver_id } = req.body

    const newMessage = await Message.create({ sender_id: _id, receiver_id, message })
    if (newMessage) {
        res.status(200).json({ "error": 0, message: newMessage })
    }
    else {
        res.status(500).json({ "error": 1 })
    }

}

const list_messages = async (req, res) => {

    const _id = req.cookies._id
    const { otherID } = req.body

    const messages = await Message.find().or([{ sender_id: _id, receiver_id: otherID }, { sender_id: otherID, receiver_id: _id }])
    res.status(200).json({ "error": 0, messages })

}

module.exports = {
    send_message,
    list_messages
}