const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const admin = require('./modules/admin')
const user = require('./modules/user')
const tweet = require('./modules/tweet')
const followship = require('./modules/followship')
const userController = require('../controllers/user-controller')
const { authenticated, authenticatedAdmin, authenticatedUser } = require('../middleware/auth')

// 取得當前使用者
router.get('/current_user', authenticated, userController.getCurrentUser)
// 後台登入
router.post('/admin/signin', passport.authenticate('local', { session: false }), authenticatedAdmin, userController.signIn)
// 前台註冊
router.post('/users', userController.signUp)
// 前台登入
router.post('/signin', passport.authenticate('local', { session: false }), authenticatedUser, userController.signIn)
// followship功能
router.use('/followships', authenticated, authenticatedUser, followship)
// tweet功能
router.use('/tweets', authenticated, authenticatedUser, tweet)
// user功能
router.use('/users', authenticated, authenticatedUser, user)
// admin功能
router.use('/admin', authenticated, authenticatedAdmin, admin)

module.exports = router
