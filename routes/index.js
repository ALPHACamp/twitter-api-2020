const express = require('express')
const passport = require('../config/passport')
const userController = require('../controllers/user-controller')
const adminController = require('../controllers/admin-controller')
const router = express.Router()
const { authenticated, authenticatedAdmin } = require('../middleware/api-auth')

// 身份驗證中間件
const { authenticated, authenticatedAdmin } = require('../middleware/api-auth')

// 路由模組載入
const admin = require('./models/admin')

router.post('/api/login', passport.authenticate('local', { session: false }), userController.login)
router.post('/api/admin/login', passport.authenticate('local', { session: false }), adminController.login)
router.use('/api/admin', authenticated, authenticatedAdmin, admin)

module.exports = router
