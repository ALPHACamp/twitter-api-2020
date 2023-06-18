const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controller')
const { apiErrorHandler } = require('../middleware/error-handler')
const passport = require('../config/passport')
const { authenticated, authenticatedAdmin, isUser } = require('../middleware/api-auth')
const admin = require('./modules/admin')
const followships = require('./modules/followships')
const tweets = require('./modules/tweets')
const users = require('./modules/users')
const adminController = require('../controllers/admin-controller')

// sign signup單獨拉出來
router.post('/api/users', userController.signUp)
router.post('/api/signin', passport.authenticate('local', { session: false }), isUser, userController.signIn)
router.post('/api/admin/users', passport.authenticate('local', { session: false }), authenticatedAdmin, adminController.signin)

// use modules
router.use('/api/admin', authenticated, authenticatedAdmin, admin)
router.use('/api/followships', authenticated, isUser, followships)
router.use('/api/tweets', authenticated, isUser, tweets)
router.use('/api/users', authenticated, isUser, users)

// Error Handler
router.use('/', apiErrorHandler)

module.exports = router
