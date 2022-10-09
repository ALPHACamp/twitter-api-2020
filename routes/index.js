const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const admin = require('./modules/admin')
const adminController = require('../controllers/admin-controller')
const userController = require('../controllers/user-controller')
const tweetController = require('../controllers/tweet-controller')
const { errorHandler } = require('../middleware/error-handler')
const { authenticated, authAdmin, authUser } = require('../middleware/auth')

// admin
router.post('/admin/signin', passport.authenticate('local', { session: false }), adminController.signin)
router.use('/admin', authenticated, authAdmin, admin)

// user
router.post('/signin', passport.authenticate('local', { session: false }), userController.signin)
router.get('/users/:id', authenticated, authUser, userController.getUser)
router.post('/users', userController.signup)

// tweet
router.get('/tweets/:id', authenticated, authUser, tweetController.getTweet)
router.get('/tweets', authenticated, authUser, tweetController.getTweets)
router.post('/tweets', authenticated, authUser, tweetController.postTweet)

// replies
router.post('/tweets/:tweet_id/replies', authenticated, authUser, tweetController.postRepliedTweet)
router.get('/tweets/:tweet_id/replies', authenticated, authUser, tweetController.getRepliedTweet)

// likes
router.post('/tweets/:id/like', authenticated, authUser, tweetController.likeTweet)
router.post('/tweets/:id/unlike', authenticated, authUser, tweetController.unlikeTweet)

// error handler
router.use('/', errorHandler)

module.exports = router
