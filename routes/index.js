const express = require('express')
const router = express.Router()
const passport = require('passport')
const tweet = require('./modules/tweet')
const admin = require('./modules/admin')
const { apiErrorHandler } = require('../middleware/error-handler')
const userController = require('../controllers/user-controller')
const { authenticated, authenticatedAdmin, authenticatedUser } = require('../middleware/auth')

router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.post('/signup', userController.signUp)
router.use('/tweets', authenticated, authenticatedUser, tweet)
router.use('/admin', authenticated, authenticatedAdmin, admin)
router.use('/', apiErrorHandler)

module.exports = router
