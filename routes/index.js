const express = require('express')
const router = express.Router()

const passport = require('../config/passport')

const userController = require('../controllers/user-controller')
const tweetController = require('../controllers/tweet-controller')

const { authenticatedAdmin, authenticatedUser, authenticated } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')
const cors = require('../middleware/cors')

router.post('/api/users/signin',cors, passport.authenticate('local', { session: false }), authenticatedUser, userController.signIn)
router.post('/api/admin/signin',cors, passport.authenticate('local', { session: false }), authenticatedAdmin, userController.signIn)

router.post('/api/users', cors, userController.signUp)

router.get('/api/tweets', cors, authenticated, authenticatedUser, tweetController.getTweets)

router.use('/', cors, generalErrorHandler)

module.exports = router