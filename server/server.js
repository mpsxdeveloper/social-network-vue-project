require('dotenv').config()
const express = require('express')
const app = express()
const { userRouter } = require('./routes/userRoutes')
const { publicationRouter } = require('./routes/publicationRoutes')
const { followerRouter } = require('./routes/followerRoutes')
const { likeRouter } = require('./routes/likeRoutes')
const { commentRouter } = require('./routes/commentRoutes')
const { messageRouter } = require('./routes/messageRoutes')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

const { createServer } = require('http')
const { Server } = require('socket.io')
const server = createServer(app)
let connectedUsers = []

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(userRouter)
app.use(publicationRouter)
app.use(followerRouter)
app.use(likeRouter)
app.use(commentRouter)
app.use(messageRouter)

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:8080'
    }
})

io.on('connection', socket => {

    socket.emit('start', 'Online')
    socket.on('username', (client) => {
        let user = {
            SID: client.SID,
            SNICK: client.SNICK
        }
        let exists = false
        for (let connectedUser of connectedUsers) {
            if (connectedUser.SNICK === client.SNICK) {
                connectedUser.SID = client.SID
                exists = true
                break
            }
        }
        if (!exists) {
            connectedUsers.push(user)
        }
        io.emit('friend-online', client, connectedUsers)

    })

    socket.on('disconnect', () => {
        connectedUsers = connectedUsers.filter(connectedUser => connectedUser.SID !== socket.id)
        io.emit('friend-offline', socket.id, connectedUsers)
    })

    socket.on('send-message', (SID, OTHERSID, MESSAGE) => {
        io.to(OTHERSID).emit('message-to-me', OTHERSID, MESSAGE)
    })

    socket.on('create-room', (SID_CREATOR, SID_OTHERPLAYER, ROOM) => {
        const MESSAGE = 'Convite para jogar Tic Tac Foe. Aceitar?'
        io.to(SID_OTHERPLAYER).emit('send-game-invite', SID_CREATOR, ROOM, MESSAGE)
    })
    socket.on('game-server-accepted', (SID_P1, SID_P2, ROOM) => {

    })
    socket.on('game-server-move', (symbol, theturn, position, room) => {
        io.emit('game-client-move', symbol, theturn, position, room)
    })

})

const dbURI = process.env.DATABASE
mongoose.set("strictQuery", true)
mongoose
    .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(server.listen(process.env.PORT, () => {
        console.log(`Server started on PORT ${process.env.PORT}`)
    }))
    .catch((err) => { console.log(err) })