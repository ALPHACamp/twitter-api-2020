const express = require('express')
const router = express.Router()

const passport = require('../config/passport')

const userController = require('../controllers/user-controller')
const tweetController = require('../controllers/tweet-controller')

const { authenticatedAdmin, authenticatedUser } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

router.post('/api/users/signin', passport.authenticate('jwt', { session: false }), authenticatedUser, userController.signIn)
router.post('/api/admin/signin', passport.authenticate('jwt', { session: false }), authenticatedAdmin, userController.signIn)

router.get('/api/tweets', tweetController.getTweets)

router.use('/', generalErrorHandler)

module.exports = router