const express = require('express')
const router = express.Router()

const tweets = require('./modules/tweets')
const users = require('./modules/users')

const passport = require('../config/passport')
const apiErrorHandler = require('../middleware/error-handler')
const { authenticator, authenticatorAdmin } = require('../middleware/api-auth')

const userController = require('../controllers/user-controller')

// 註冊＆登入相關路由
router.post('/users', userController.signUp, userController.signIn) // No.1 - 註冊帳號
router.post('/users/signin', passport.authenticate('local', { session: false, failWithError: true }), userController.signIn) // No.2 - 登入前台帳號

router.use('/users', authenticator, users)
router.use('/tweets', authenticator, tweets)

router.use('/', (req, res) => res.status(500).json({ success: false, message: 'no such api' })) // fallback路由
router.use('/', apiErrorHandler) // 錯誤處理

module.exports = router
