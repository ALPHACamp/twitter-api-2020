const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const userController = require('../controllers/user-controller')
const tweetController = require('../controllers/tweet-controller')
const { apiErrorHandler } = require('../middleware/error-handler')
const { authenticated } = require('../middleware/auth')

router.post('/users/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.post('/users', userController.signUp)

router.post('/tweets', authenticated, tweetController.postTweet)
router.get('/tweets', authenticated, tweetController.getTweets)

router.use('/', apiErrorHandler)

module.exports = router
