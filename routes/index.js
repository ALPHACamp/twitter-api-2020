const express = require('express')
// 待確認，passport.authenticate 是他內建的，不是載入這個config裡的
// const { authenticate } = require('../config/passport')
const router = express.Router()
const passport = require('../config/passport')
// const admin = require('./modules/admin')
const { authenticated, authenticatedCurrentUser } = require('../middleware/api-auth')
const userController = require('../controllers/user-controller')
const adminController = require('../controllers/admin-controller')
const { apiErrorHandler } = require('../middleware/error-handler')
const tweet = require('./modules/tweet')

// router.use('/admin', authenticated, authenticatedAdmin, admin)
// admin
router.post('/admin/signin', passport.authenticate('local', { session: false }), adminController.signIn) // 管理者登入

// users
router.post('/users/signin', passport.authenticate('local', { session: false }), userController.signIn) // 使用者登入
router.post('/users/', userController.signUp) // 註冊

// modules
router.use('/tweets', authenticated, authenticatedCurrentUser, tweet)

router.use('/', apiErrorHandler)
module.exports = router
