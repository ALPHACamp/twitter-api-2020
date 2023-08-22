const express = require('express')
const router = express.Router()

const passport = require('../config/passport')
const apiErrorHandler = require('../middleware/error-handler')

const userController = require('../controllers/user-controller')

router.post('/users', userController.signUp) // 註冊帳號
router.post('/users/signin', passport.authenticate('local', { session: false, failWithError: true }), userController.signIn) // 登入前台帳號

router.use('/', (req, res) => res.status(500).json({ status: 'error', message: 'no such api' })) // fallback路由
router.use('/', apiErrorHandler) // 錯誤處理

module.exports = router
