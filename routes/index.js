const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const user = require('./modules/user')
const userController = require('../controllers/user-controller')
const { authenticated, authenticatedUser } = require('../middleware/auth')
const { apiErrorHandler } = require('../middleware/error-handler')
router.post('/users', userController.signUp)
router.post('/users/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.use('/users', authenticated, authenticatedUser, user)
router.use('/', apiErrorHandler)

module.exports = router
