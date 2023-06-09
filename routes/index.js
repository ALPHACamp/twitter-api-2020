const router = require('express').Router()
const admin = require('./modules/admin')
const users = require('./modules/users')
const tweets = require('./modules/tweets')
const followships = require('./modules/followship')
const { apiErrorHandler } = require('../middleware/error-handler')
const { authenticated } = require('../middleware/auth')
const passport = require('passport')
const userController = require('../controllers/user-controller')
const adminController = require('../controllers/admin-controller')
const { isUser, isAdmin, isAuthUser, isAuthAdmin } = require('../middleware/role-check')

// admin
router.post('/api/admin/login', passport.authenticate('local', { session: false }), isAdmin, adminController.login)
router.use('/api/admin', authenticated, isAuthAdmin, admin)

// users
router.post('/api/users', userController.signup)
router.post('/api/users/login', passport.authenticate('local', { session: false }), isUser, userController.login)
router.use('/api/users', authenticated, isAuthUser, users)

// tweets
router.use('/api/tweets', authenticated, isAuthUser, tweets)

// followships
router.use('/api/followships', authenticated, isAuthUser, followships)

// error handler
router.use('/', apiErrorHandler)

module.exports = router
