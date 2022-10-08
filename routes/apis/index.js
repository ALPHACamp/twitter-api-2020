const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const userController = require('../../controllers/user-controller')
const tweetController = require('../../controllers/tweet-controller')
const followshipController = require('../../controllers/followship-controller')

// const { authenticated } = require('../../middleware/api-auth')

router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)

// Tweets
router.get('/tweets/:id/replies', tweetController.getReplies)
router.post('/tweets/:id/replies', tweetController.postReply)
router.post('/tweets/:id/like', tweetController.likeTweet)
router.post('/tweets/:id/unlike', tweetController.unlikeTweet)
router.get('/tweets/:id', tweetController.getTweet)
router.post('/tweets', tweetController.postTweet)
router.get('/tweets', tweetController.getTweets)

// Followship
router.post('/followships/:userId', followshipController.addFollowing)
router.delete('/followships/:userId', followshipController.removeFollowing)

module.exports = router
