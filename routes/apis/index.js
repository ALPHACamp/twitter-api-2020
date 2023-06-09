const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const { apiErrorHandler } = require('../../middleware/error-handler')
const passport = require('../../config/passport')
const { authenticated, authenticatedAdmin, isUser } = require('../../middleware/api-auth')

// import modules
const admin = require('./modules/admin')
const followships = require('./modules/followships')
const likes = require('./modules/likes')
const tweets = require('./modules/tweets')
const users = require('./modules/users')

// sign signup單獨拉出來
router.post('/users', userController.signUp)
router.post('/signin', passport.authenticate('local', { session: false }), isUser, userController.signIn)

// use modules
router.use('/admin', authenticatedAdmin, admin)
router.use('/followships', followships)
router.use('/likes', likes)
router.use('/tweets', tweets)
router.use('/users', authenticated, isUser, users)

// Error Handler
router.use('/', apiErrorHandler)

module.exports = router
