const express = require('express')
const router = express.Router()

const passport = require('../config/passport')
const apiErrorHandler = require('../middleware/error-handler')
const { authenticator, authenticatorAdmin } = require('../middleware/api-auth')

const userController = require('../controllers/user-controller')

router.post('/users', userController.signUp) // No.1 - 註冊帳號
router.post('/users/signin', passport.authenticate('local', { session: false, failWithError: true }), userController.signIn) // No.2 - 登入前台帳號

// users相關路由
// No.3 - 查看某使用者的資料 GET /api/users/:id

router.get('/users/:id/tweets', authenticator, userController.getUserTweets) // No.4 - 查看某使用者發過的推文
// router.get('/api/users/:id/replied_tweets', authenticator, userController.getUserReplies) // No.5 - 查看某使用者發過的回覆
// router.get('/api/users/:id/likes', authenticator, userController.getUserLikes) // No.6 - 查看某使用者點過like的推文

router.use('/', (req, res) => res.status(500).json({ status: 'error', message: 'no such api' })) // fallback路由
router.use('/', apiErrorHandler) // 錯誤處理

module.exports = router
