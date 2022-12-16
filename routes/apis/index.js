const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const admin = require('./modules/admin')

const userController = require('../../controllers/user-controller')
const tweetController = require('../../controllers/tweet-controller')

const { authenticated } = require('../../middleware/api-auth')
const { apiErrorHandler } = require('../../middleware/error-handler')

// router.use('/admin', authenticated, authenticatedAdmin, admin)
router.use('/admin', passport.authenticate('local', { session: false }), admin)

router.post('/users', userController.register)

router.post('/login', passport.authenticate('local', { session: false }), userController.login)
router.get('/users/:user_id', authenticated, userController.getUser)

router.get('/tweets/:tweet_id', authenticated, tweetController.getTweet)
router.get('/tweets', authenticated, tweetController.getTweets)
router.post('/tweets', authenticated, tweetController.postTweets)

router.use('/', apiErrorHandler)

module.exports = router
