const express = require('express')
const router = express.Router()
const { errorHandler } = require('../middleware/error-handler')

const passport = require('../config/passport')

// Controller
const userController = require('../controllers/user-controller')

// Middleware
const { authenticated } = require('../middleware/auth')

const users = require('./module/users')

router.post('/users', userController.signUp)
router.post('/users/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.use('/users', authenticated, users)
router.use('/', errorHandler)

module.exports = router
