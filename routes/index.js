const express = require('express')
const passport = require('../config/passport')
const { apiErrorHandler } = require('../middleware/error-handler')
const router = express.Router()
const admin = require('./modules/admin')
const users = require('./modules/users')
const tweets = require('./modules/tweets')
const followships = require('./modules/followships')
const replies = require('./modules/replies')
const userController = require('../controllers/user-controller')
const { authenticated, authenticatedAdmin, authenticatedUser } = require('../middleware/auth')

// 將不同的 routes 拆分
router.use('/admin', authenticated, authenticatedAdmin, admin)
// router.post('/users/signup', userController.signUp) #Todo
router.post('/users/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.use('/users', authenticated, authenticatedUser, users) // 把 authenticated, authenticatedUser, 加回去 #Todo
router.use('/tweets', authenticated, authenticatedUser, tweets)
router.use('/followships', authenticated, authenticatedUser, followships)
router.use('/replies', authenticated, authenticatedUser, replies)
router.use('/', apiErrorHandler)

module.exports = router
