const express = require('express')
const router = express.Router()
const passport = require('passport')

const admin = require('./modules/admin')
const user = require('./modules/user')
const tweet = require('./modules/tweet')
const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedUser, authenticatedAdmin } = require('../middleware/auth')
const userController = require('../controllers/user-controller')

// admin
router.use('/api/admin', authenticated, authenticatedAdmin, admin)

// user management
router.post('/api/users/login', passport.authenticate('local', { session: false }), userController.userLogin)
router.post('/api/users', userController.postUser)

// tweet
router.use('/api/tweets', authenticated, authenticatedUser, tweet)

// user
router.use('/api', authenticated, authenticatedUser, user)

// handle error
router.use('/', generalErrorHandler)

module.exports = router
