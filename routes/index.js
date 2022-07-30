const express = require('express')
const router = express.Router()

const { errorHandler } = require('../middleware/error-handler')

const passport = require('../config/passport')

// Controller
const userController = require('../controllers/user-controller')
const adminController = require('../controllers/admin-controller')

// Middleware
const { authenticated } = require('../middleware/auth')

// module
const users = require('./modules/users')
const tweets = require('./modules/tweets')

router.post('/admin/signin', passport.authenticate('local', { session: false }), adminController.signIn)
router.post('/users', userController.signUp)
router.post('/users/signin', passport.authenticate('local', { session: false }), userController.signIn)

router.use('/users', authenticated, users)
router.use('/tweets', authenticated, tweets)

router.use('/', errorHandler)

module.exports = router
