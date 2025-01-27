const express = require('express')
const multer = require('multer')
const publicationController = require('../controllers/publicationController')

const publicationRouter = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/pictures')
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

publicationRouter.post('/server/publication', upload.single('publicacao'), publicationController.post_publication)
publicationRouter.get('/server/publication/list', publicationController.list_publications)
publicationRouter.get('/server/comment/delete/:comment_id/:publication_id', publicationController.delete_comment)
publicationRouter.get('/server/publication/list/my', publicationController.list_mypublications)

module.exports = {
    publicationRouter
}