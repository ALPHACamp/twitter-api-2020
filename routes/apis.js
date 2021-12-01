const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const passport = require('../config/passport')

const userController = require('../controllers/api/userControllers')
const tweetController = require('../controllers/api/tweetControllers')

router.get('/users', userController.getUsers)
router.get('/tweets', tweetController.getTweets)

module.exports = router
