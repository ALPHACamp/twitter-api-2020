const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const userController = require('../controllers/user-controller')
const { errorHandler } = require('../middleware/error-handler')
const { authenticated, authAdmin, authUser } = require('../middleware/auth')

// user
router.post('/signin', passport.authenticate('local', { session: false }), userController.signin)
router.post('/users', userController.signup)

// error handler
router.use('/', errorHandler)

module.exports = router
