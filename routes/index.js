const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')

const userController = require('../controllers/apis/user-controller')
const tweetContorller = require('../controllers/apis/tweet-controller')

const { apiErrorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedAdmin, authenticatedUser } = require('../middleware/api-auth')

// api/admin
router.use('/api/admin', authenticated, authenticatedAdmin, admin)
// router.use("/api/admin", admin);

// api/users
// router.get('/api/users', userController.getUsers)
router.post('/api/users', userController.signUp)
router.post('/api/users/signin', userController.signIn)
router.get('/api/users/:id/replied_tweets', authenticated, authenticatedUser, userController.getUserReplies)
router.get('/api/users/:id', authenticated, authenticatedUser, userController.getUser)

// api/tweets
router.post('/api/tweets/:tweet_id/like', authenticated, authenticatedUser, tweetContorller.likeTweet)
router.get('/api/tweets/:tweet_id', authenticated, authenticatedUser, tweetContorller.getTweet)
router.get('/api/tweets', authenticated, authenticatedUser, tweetContorller.getTweets)

router.use('/', apiErrorHandler)

module.exports = router
