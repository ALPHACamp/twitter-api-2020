const express = require('express')
const router = express.Router()
const passport = require('passport')
const tweet = require('./modules/tweet')
const user = require('./modules/user')
const userController = require('../controllers/user-controller')
const { apiErrorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedAdmin, authenticatedUser } = require('../middleware/auth')

router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.post('/signup', userController.signUp)
router.use('/users', user)
router.use('/tweets', authenticated, authenticatedUser, tweet)
router.use('/', apiErrorHandler)

module.exports = router
