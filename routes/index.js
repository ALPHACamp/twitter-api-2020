const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controller')
// const dummyController = require('../controllers/dummy-controller')

const { apiErrorHandler } = require('../middleware/error-handler')
const passport = require('../config/passport')
const { authenticated, authenticatedAdmin, isUser } = require('../middleware/api-auth')
const admin = require('./modules/admin')
const followships = require('./modules/followships')
const likes = require('./modules/likes')
const tweets = require('./modules/tweets')
const users = require('./modules/users')
// sign signup單獨拉出來

router.post('/api/users', userController.signUp)
router.post('/api/signin', passport.authenticate('local', { session: false }), isUser, userController.signIn)

// use modules
router.use('/admin', authenticatedAdmin, admin)
router.use('/followships', authenticated, isUser, followships)
router.use('/likes', authenticated, isUser, likes)
router.use('/tweets', authenticated, isUser, tweets)
router.use('/users', authenticated, isUser, users)

// Error Handler
router.use('/', apiErrorHandler)

module.exports = router
