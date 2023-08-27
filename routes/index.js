const express = require('express')
// 待確認，passport.authenticate 是他內建的，不是載入這個config裡的
// const { authenticate } = require('../config/passport')
const router = express.Router()
const passport = require('../config/passport')
// const admin = require('./modules/admin')

const userController = require('../controllers/user-controller')
const adminController = require('../controllers/admin-controller')
const { apiErrorHandler } = require('../middleware/error-handler')
const { authenticated } = require('../middleware/api-auth')
const tweet = require('./modules/tweet')

// router.use('/admin', authenticated, authenticatedAdmin, admin)
// admin
router.post('/admin/signin', passport.authenticate('local', { session: false }), adminController.signIn) // 管理者登入

// users 後續會移進module裡面，怕有更多衝突要解，因此目前還是先放外面等到重構時再移
router.post('/users/signin', passport.authenticate('local', { session: false }), userController.signIn) // 使用者登入
router.post('/users/', userController.signUp) // 註冊
router.get('/users/:id', authenticated, userController.getUserProfile) // 個人資料頁面

// modules
router.use('/tweets', authenticated, tweet)

router.use('/', apiErrorHandler)
module.exports = router
