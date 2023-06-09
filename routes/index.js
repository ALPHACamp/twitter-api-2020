const express = require('express')
const router = express.Router()

const userController = require('../controllers/user-controller')
const tweetController = require('../controllers/tweet-controller')

const { authenticatedAdmin, authenticatedUser, authenticated } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')
const cors = require('../middleware/cors')

// signup & signin
// router.post('/api/admin/signin', cors, userController.signIn) // ! admin登入要和user拆開
router.post('/api/users/signin', cors, userController.signIn)
router.post('/api/users', cors, userController.signUp)

// user
router.get('/api/users/:id', cors, authenticated, authenticatedUser, userController.getUser)
router.get('/api/users/:id/tweets', cors, authenticated, authenticatedUser, userController.getUserTweets)

// tweet
router.get('/api/tweets/:id', cors, authenticated, authenticatedUser, tweetController.getTweet)
router.get('/api/tweets', cors, authenticated, authenticatedUser, tweetController.getTweets)
router.post('/api/tweets', cors, authenticated, authenticatedUser, tweetController.postTweets)

router.use('/', cors, generalErrorHandler)

module.exports = router