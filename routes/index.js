const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const userController = require('../controllers/user-controller')
const tweetController = require('../controllers/tweet-controller')
const { errorHandler } = require('../middleware/error-handler')
const { authenticated, authAdmin, authUser } = require('../middleware/auth')

// user
router.post('/signin', passport.authenticate('local', { session: false }), userController.signin)
router.post('/users', userController.signup)
router.get('/users/:id', authenticated, authUser, userController.getUser)

// tweet
router.get('/tweets', authenticated, authUser, tweetController.getTweets)
router.post('/tweets', authenticated, authUser, tweetController.postTweet)
router.get('/tweets/:id', authenticated, authUser, tweetController.getTweet)

// replies
router.post('/tweets/:tweet_id/replies', authenticated, authUser, tweetController.postRepliedTweet)
router.get('/tweets/:tweet_id/replies', authenticated, authUser, tweetController.getRepliedTweet)

// error handler
router.use('/', errorHandler)

module.exports = router
