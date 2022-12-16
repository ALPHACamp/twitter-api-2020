const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const admin = require('./modules/admin')

const userController = require('../../controllers/user-controller')
const tweetController = require('../../controllers/tweet-controller')

const { authenticated, authenticatedUser } = require('../../middleware/api-auth')
const { apiErrorHandler } = require('../../middleware/error-handler')

router.use('/admin', admin)

router.post('/users', userController.register)

router.post('/login', passport.authenticate('local', { session: false }), userController.login)

router.get('/tweets/:tweet_id', authenticated, authenticatedUser, tweetController.getTweet)
router.get('/tweets', authenticated, authenticatedUser, tweetController.getTweets)
router.post('/tweets', authenticated, authenticatedUser, tweetController.postTweets)

router.use('/', apiErrorHandler)

module.exports = router
