const express = require('express')
const router = express.Router()
// const passport = require('../../config/passport')

const admin = require('./modules/admin')
const userController = require('../../controllers/user-controller')
const tweetController = require('../../controllers/tweet-controller')
const followshipController = require('../../controllers/followship-controller')

const { apiErrorHandler } = require('../../middleware/error-handler')

// Admin
router.use('/admin', admin)

// Users
router.post('/users', userController.signUp)

// Tweets
router.get('/tweets/:id/replies', tweetController.getReplies)
router.post('/tweets/:id/replies', tweetController.postReply)
router.post('/tweets/:id/like', tweetController.likeTweet)
router.post('/tweets/:id/unlike', tweetController.unlikeTweet)
router.get('/tweets/:id', tweetController.getTweet)
router.post('/tweets', tweetController.postTweet)
router.get('/tweets', tweetController.getTweets)

// Followship
router.get('/followships/top', followshipController.getTopFollowship)
router.post('/followships/:followingId', followshipController.addFollowing)
router.delete('/followships/:followingId', followshipController.removeFollowing)

router.use('/', apiErrorHandler)

module.exports = router
