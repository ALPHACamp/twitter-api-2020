const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const userController = require('../controller/user-controller')
const tweetController = require('../controller/tweet-Controller')
const { authenticated, authenticatedAdmin, authenticatedUser } = require('../middleware/api-auth')
const { apiErrorHandler } = require('../middleware/error-handler')

// Tweets
router.get('/api/tweets', tweetController.getTweets)
// Users
router.post('/api/users/login', userController.signIn)
router.post('/api/users', userController.signUp)
router.get('/users/:id', authenticated, authenticatedUser, userController.getUser)
router.use('/', apiErrorHandler)

module.exports = router
