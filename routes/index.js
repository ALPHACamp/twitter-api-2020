const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')
const user = require('./modules/users')
const tweet = require('./modules/tweet')
const followship = require('./modules/followship')
const adminController = require('../controllers/admin-controller')
const userController = require('../controllers/user-controller')

const { authenticated, authenticatedAdmin, authenticatedUser } = require('../middleware/auth')
const { apiErrorHandler } = require('../middleware/error-handler')
const { adminSignIn, userSignIn } = require('../middleware/login-handler')

// followship相關路由
router.use('/followships', authenticated, authenticatedUser, followship)
// user相關路由、登入註冊
router.post('/users/signin', userSignIn, userController.signIn)
router.post('/users', userController.signUp)
router.use('/users', authenticated, authenticatedUser, user)
// admin登入
router.post('/admin/signin', adminSignIn, adminController.signIn)
// admin其他路由
router.use('/admin', authenticated, authenticatedAdmin, admin)
// tweet相關路由
router.use('/tweets', authenticated, authenticatedUser, tweet)

router.use('/', apiErrorHandler)

module.exports = router
