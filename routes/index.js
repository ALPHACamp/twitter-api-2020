const express = require('express')
const router = express.Router()

const passport = require('../config/passport')
const apiErrorHandler = require('../middleware/error-handler')

const userController = require('../controllers/user-controller')

router.post('/users', userController.signUp) // 註冊帳號
router.post('/users/signin', passport.authenticate('local', { session: false, failWithError: true }), userController.signIn) // 登入前台帳號

// users相關路由
// No.3 - 查看某使用者的資料 GET /api/users/:id

// No.4 - 查看某使用者發過的推文 GET /api/users/:id/tweets

// No.5 - 查看某使用者發過的回覆 GET /api/users/:id/replied_tweets

// No.6 - 查看某使用者點過like的推文 GET /api/users/:id/likes

router.use('/', (req, res) => res.status(500).json({ status: 'error', message: 'no such api' })) // fallback路由
router.use('/', apiErrorHandler) // 錯誤處理

module.exports = router
