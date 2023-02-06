const express = require('express')
const router = express.Router()

const user = require('./modules/user')
const tweet = require('./modules/tweet')
const admin = require('./modules/admin')
const followship = require('./modules/followship')
const userController = require('../controllers/user-controller')
const adminController = require('../controllers/admin-controller')
const { authenticated, authenticatedUser, authenticatedAdmin } = require('../middleware/auth')
const { apiErrorHandler } = require('../middleware/error-handler')
const passport = require('../config/passport')

router.use('/tweets', authenticated, authenticatedUser, tweet) // authenticatedUser

// 使用者註冊
router.post('/users', userController.signUp)
// 使用者登入
router.post('/users/signin', passport.authenticate('local', { session: false }), userController.signIn)
// 管理者登入
router.post('/admin/signin', passport.authenticate('local', { session: false }), adminController.signIn)

router.use('/users', authenticated, authenticatedUser, user)
router.use('/followships', authenticated, authenticatedUser, followship)
router.use('/admin', authenticated, authenticatedAdmin, admin)
router.use('/', apiErrorHandler)

module.exports = router
