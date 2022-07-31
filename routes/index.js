const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const userController = require('../controllers/user-controller')
const adminController = require('../controllers/admin-controller')
const { authenticated, authenticatedAdmin, authenticatedUser } = require('../middleware/auth')
const { apiErrorHandler } = require('../middleware/error-handler')
const admin = require('./modules/admin')
const tweets = require('./modules/tweets')
const followship = require('./modules/followship')
const users = require('./modules/users')

//登入與註冊相關
router.post('/api/users/signin', passport.authenticate('local', { session: false }), authenticatedUser, userController.signIn)
router.post('/api/users', userController.signUp) //註冊
router.post('/api/admin/users', passport.authenticate('local', { session: false }), authenticatedAdmin, adminController.signIn)
router.use('/api/admin', authenticated, authenticatedAdmin, admin)
router.use('/api/tweets', authenticated, authenticatedUser, tweets)
router.use('/api/followships', authenticated, authenticatedUser, followship)
router.use('/api/users', authenticated, authenticatedUser, users)

router.use('/', apiErrorHandler)

module.exports = router