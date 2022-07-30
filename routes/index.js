const express = require('express')
const router = express.Router()

const { errorHandler } = require('../middleware/error-handler')

const passport = require('../config/passport')

// Controller
const userController = require('../controllers/user-controller')
const adminController = require('../controllers/admin-controller')

// Middleware
const { authenticated } = require('../middleware/auth')

const users = require('./module/users')
const tweets = require('./module/tweets')
const followships = require('./module/followships')

router.post('/admin/signin', passport.authenticate('local', { session: false }), adminController.signIn)
router.post('/users', userController.signUp)
router.post('/users/signin', passport.authenticate('local', { session: false }), userController.signIn)

router.use('/users', authenticated, users)
router.use('/tweets', tweets)
router.use('/followships', followships)

router.use('/', errorHandler)

module.exports = router
