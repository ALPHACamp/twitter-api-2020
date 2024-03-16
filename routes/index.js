const express = require('express')
const passport = require('passport')

const { authenticated, authenticatedSuccess, authenticatedUser, authenticatedAdmin } = require('../middleware/auth')
const { registerValidation } = require('../middleware/server-side-validation')

const userController = require('../controllers/user-controller')
const adminController = require('../controllers/admin-controller')

const tweets = require('./modules/tweets')
const admin = require('./modules/admin')
const users = require('./modules/user')
const followship = require('./modules/followship')

const router = express.Router()

// routes that not have to authenticate
router.post('/admin/signin', passport.authenticate('local', { session: false }), adminController.signIn)
router.post('/users', registerValidation, userController.signUp)
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)

// check permission route
router.get('/auth/test-token', authenticated, authenticatedSuccess)

// routes for background system => authenticated admin
router.use('/admin', authenticated, authenticatedAdmin, admin)

// routes for foreground system => authenticated normal user
router.use('/tweets', authenticated, authenticatedUser, tweets)
router.use('/users', authenticated, authenticatedUser, users)
router.use('/followships', authenticated, authenticatedUser, followship)

module.exports = router
