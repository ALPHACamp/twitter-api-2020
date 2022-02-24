const express = require('express')
const passport = require('passport')
const router = express.Router()
const { apiErrorHandler } = require('../../middleware/error-handlers')
const userController = require('../../controllers/apis/user-controller')
const adminController = require('../../controllers/apis/admin-controller')
const tweetController = require('../../controllers/apis/tweet-controller')
const { authenticated, authenticatedAdmin, authenticatedUser } = require('../../middleware/apiAuth')

router.post('/tweets', authenticated, authenticatedUser, tweetController.postTweet)
router.get('/tweets', authenticated, authenticatedUser, tweetController.getTweets)
router.get('/tweets/:id', authenticated, authenticatedUser, tweetController.getTweet)
router.post('/users/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.post('/users', userController.signUp)
router.post('/admin/signin', passport.authenticate('local', { session: false }), adminController.signIn)
router.use('/', apiErrorHandler)

module.exports = router
