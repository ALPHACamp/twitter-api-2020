const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const userController = require('../controllers/user-controller')
const adminController = require('../controllers/admin-controller')

// 中間件
const { authenticated, authenticatedAdmin, authenticatedUser } = require('../middleware/auth')
const { errorHandler } = require('../middleware/error-handler')

// 後台路由模組載入
const admin = require('./models/admin')

// 前台路由模組載入

const reception = require('./models/reception')

// 登入相關路由
router.post('/api/login', passport.authenticate('local', { session: false }), userController.login)
router.post('/api/admin/login', passport.authenticate('local', { session: false }), adminController.login)
router.post('/api/users', userController.signUp)

// 導入後台
router.use('/api/admin', authenticated, authenticatedAdmin, admin)

// 導入前台
router.use('/api', authenticated, authenticatedUser, reception)

// 錯誤處理
router.use('/', errorHandler)

module.exports = router
