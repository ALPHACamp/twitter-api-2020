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
router.get('/api/tweets', authToken, authUserRole, tweetController.getTweets)
router.get('/api/tweets/:id', authToken, authUserRole, tweetController.getTweet)
router.put('/api/tweets/:id', authToken, authUserRole, tweetController.updateTweet)
router.delete('/api/tweets/:id', authToken, authUserRole, tweetController.deleteTweet)

//users
router.post('/api/login', userController.login)
router.post('/api/users', userController.createUser)
router.get('/api/users/top', authToken, authUserRole, userController.getTopUsers)
router.get('/api/users/:id', authToken, authUserRole, userController.getUser)
//admin
router.get('/api/admin/users', authToken, authAdminRole, userController.getUsers)

module.exports = router