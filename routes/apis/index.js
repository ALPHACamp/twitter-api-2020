const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const userController = require('../../controllers/user-controller')
const tweetController = require('../../controllers/tweet-controller')

// const { authenticated } = require('../../middleware/api-auth')

router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)

// Tweets
router.get('/tweets/:id', tweetController.getTweet)
router.post('/tweets', tweetController.postTweet)
router.get('/tweets', tweetController.getTweets)

module.exports = router
