const express = require('express')
const passport = require('../config/passport')
const userController = require('../controllers/user-controller')
const adminController = require('../controllers/admin-controller')
const tweetController = require('../controllers/tweet-controller')
const router = express.Router()

// 身份驗證中間件
const { authenticated, authenticatedAdmin } = require('../middleware/api-auth')

// 路由模組載入
const admin = require('./models/admin')

// 登入相關路由
router.post('/api/login', passport.authenticate('local', { session: false }), userController.login)
router.post('/api/admin/login', passport.authenticate('local', { session: false }), adminController.login)

// 導入後台
router.use('/api/admin', authenticated, authenticatedAdmin, admin)

// 推文相關路由
router.get('/api/tweets/:id', authenticated, tweetController.getOne)
router.get('/api/tweets', authenticated, tweetController.getAll)
router.post('/api/tweets', authenticated, tweetController.create)

module.exports = router
