const express = require('express')
const router = express.Router()

const user = require('./modules/user')
const tweet = require('./modules/tweet')
const userController = require('../controllers/user-controller')
const { authenticated, authenticatedUser } = require('../middleware/auth')
const { apiErrorHandler } = require('../middleware/error-handler')
const passport = require('../config/passport')

router.post('/users', userController.signUp)

router.post('/users/signin', passport.authenticate('local', { session: false }), userController.signIn)

router.use('/users', authenticated, authenticatedUser, user)
router.use('/tweets', authenticated, authenticatedUser, tweet) // authenticatedUser
router.use('/', apiErrorHandler)

module.exports = router
