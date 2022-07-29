const express = require('express')
const router = express.Router()

const { errorHandler } = require('../middleware/error-handler')

const passport = require('../config/passport')

// Controller
const tweetController = require('../controllers/tweet-controller')
const userController = require('../controllers/user-controller')
const adminController = require('../controllers/admin-controller')

// Middleware
const { authenticated } = require('../middleware/auth')

const users = require('./module/users')

router.post('/admin/signin', passport.authenticate('local', { session: false }), adminController.signIn)
router.post('/users', userController.signUp)
router.post('/users/signin', passport.authenticate('local', { session: false }), userController.signIn)

router.use('/users', authenticated, users)

router.get('/tweets', tweetController.getTweets)
router.post('/tweets', tweetController.postTweet)

router.use('/', errorHandler)

module.exports = router
