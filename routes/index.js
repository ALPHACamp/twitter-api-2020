const express = require('express')
const router = express.Router()

// controllers
const userController = require('../controllers/userController')
const tweetController = require('../controllers/tweetController')
const likeController = require('../controllers/likeController')
const replyController = require('../controllers/replyController')
const followshipController = require('../controllers/followshipController')

// authorizers
const { authToken, authUserRole, authAdminRole } = require('../middleware/auth')

// routes
// tweet
router.post('/api/tweets', authToken, authUserRole, tweetController.createTweet)
// router.get('/api/tweets/:id', tweetController.getTweet)
router.put('/api/tweets/:id', authToken, authUserRole, tweetController.updateTweet)
router.delete('/api/tweets/:id', authToken, authUserRole, tweetController.deleteTweet)

// users
router.post('/api/login', userController.login)
router.post('/api/users', userController.createUser)

module.exports = router
