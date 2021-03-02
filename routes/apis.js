const express = require('express')
const router = express.Router()
const adminController = require('../controllers/api/adminController')
const followController = require('../controllers/api/followController')
const likeController = require('../controllers/api/likeController')
const replyController = require('../controllers/api/replyController')
const tweetController = require('../controllers/api/tweetController')
const userController = require('../controllers/api/userController')

router.post('/users', userController.signUp)
router.post('/users/signIn', userController.signIn)


// admin
router.get('/admin/users', adminController.getUsers)
router.get('/admin/tweets', adminController.getTweets)

module.exports = router