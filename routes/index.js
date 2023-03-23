const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const userController = require('../controllers/user-controller')
const tweetController = require('../controllers/tweet-controller')
const { apiErrorHandler } = require('../middleware/error-handler')
const { authenticated } = require('../middleware/auth')

const admin = require('./modules/admin')

router.use('/admin', admin)

router.post('/users/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.post('/users', userController.signUp)

router.post('/tweets/:id/like', authenticated, tweetController.likeTweet)
router.post('/tweets/:id/unlike', authenticated, tweetController.unlikeTweet)
router.post('/tweets/:tweet_id/replies', authenticated, tweetController.postReply)
router.get('/tweets/:tweet_id/replies', authenticated, tweetController.getReplies)
router.get('/tweets/:tweet_id', authenticated, tweetController.getTweet)
router.post('/tweets', authenticated, tweetController.postTweet)
router.get('/tweets', authenticated, tweetController.getTweets)

router.delete('/followships/:followingId', authenticated, userController.removeFollowing)
router.post('/followships', authenticated, userController.addFollowing)

router.use('/', apiErrorHandler)

module.exports = router
