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
router.post('/api/tweets', tweetController.createTweet)
// router.get('/api/tweets/:id', tweetController.getTweet)
router.put('/api/tweets/:id', tweetController.updateTweet)
router.delete('/api/tweets/:id', tweetController.deleteTweet)

module.exports = router
