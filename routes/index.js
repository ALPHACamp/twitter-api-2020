const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const userController = require('../controller/user-controller')
const { authenticated, authenticatedAdmin } = require('../middleware/api-auth')
const { apiErrorHandler } = require('../middleware/error-handler')

router.post('/api/users/login', passport.authenticate('local', { session: false }), userController.signIn)
router.post('/api/users/signup', userController.signUp)
router.use('/', apiErrorHandler)

module.exports = router
