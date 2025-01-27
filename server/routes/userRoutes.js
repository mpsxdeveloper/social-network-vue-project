const express = require('express')
const userController = require('../controllers/userController')
const checkToken = require('../middleware/checkToken')
const multer = require('multer')

const userRouter = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './tmp')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + Math.floor(Math.random() * 99999999) + '.jpg')
    }
})

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpg', 'image/jpeg', 'image/png']
        cb(null, allowed.includes(file.mimetype))
    },
    limits: {
        fieldSize: 1000000
    }
})

userRouter.post('/server/login', userController.login)
userRouter.post('/server/register', userController.register)
userRouter.get('/server/home', checkToken, userController.home)
userRouter.post('/server/picture', upload.single('avatar'), userController.update_picture)
userRouter.get('/server/avatar', userController.get_avatar)
userRouter.get('/server/logout', userController.logout)

module.exports = {
    userRouter
}