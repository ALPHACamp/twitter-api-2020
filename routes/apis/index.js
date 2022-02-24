const express = require('express')
const passport = require('passport')
const router = express.Router()
const { apiErrorHandler } = require('../../middleware/error-handlers')
const userController = require('../../controllers/apis/user-controller')
const adminController = require('../../controllers/apis/admin-controller')
const tweetController = require('../../controllers/apis/tweet-controller')
const { authenticated, authenticatedAdmin, authenticatedUser } = require('../../middleware/apiAuth')

router.post('/tweets/:id/like', tweetController.addLike)
router.post('/tweets/:id/unlike', tweetController.removeLike)
router.post('/tweets/:id/replies', tweetController.postReply)
router.get('/tweets/:id/replies', tweetController.getReplies)
router.get('/tweets/:id', tweetController.getTweet)
router.post('/tweets', tweetController.postTweet)
router.get('/tweets', tweetController.getTweets)
router.post('/users/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.post('/users', userController.signUp)
router.post('/admin/signin', passport.authenticate('local', { session: false }), adminController.signIn)

router.use('/', apiErrorHandler)

module.exports = router
