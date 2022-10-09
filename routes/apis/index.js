const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')

const admin = require('./modules/admin')
const userController = require('../../controllers/user-controller')
const tweetController = require('../../controllers/tweet-controller')
const followshipController = require('../../controllers/followship-controller')

const { authenticated } = require('../../middleware/api-auth')
const { apiErrorHandler } = require('../../middleware/error-handler')

// Admin
router.use('/admin', admin)

// Users
router.post('/users/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.post('/users', userController.signUp)

// Tweets
router.get('/tweets/:id/replies', authenticated, tweetController.getReplies)
router.post('/tweets/:id/replies', authenticated, tweetController.postReply)
router.post('/tweets/:id/like', authenticated, tweetController.likeTweet)
router.post('/tweets/:id/unlike', authenticated, tweetController.unlikeTweet)
router.get('/tweets/:id', authenticated, tweetController.getTweet)
router.post('/tweets', authenticated, tweetController.postTweet)
router.get('/tweets', authenticated, tweetController.getTweets)

// Followship
router.get('/followships/top', followshipController.getTopFollowship)
router.post('/followships', followshipController.addFollowing)
router.delete('/followships/:followingId', followshipController.removeFollowing)

router.use('/', apiErrorHandler)

module.exports = router
