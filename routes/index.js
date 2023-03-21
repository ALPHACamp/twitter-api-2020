const express = require('express')
const router = express.Router()

const userController = require('../controllers/user-controller')
const passport = require('../config/passport')
const admin = require('./modules/admin')
const { authenticated, authenticatedAdmin } = require('../middleware/api-auth')
const { apiErrorHandler } = require('../middleware/error-handler')

// (下1) 純測試，之後得改
router.get('/api/admin/restaurants', authenticated, apiErrorHandler)

router.post('/api/users', userController.signUp) // 註冊帳號路由
// (下1) session: false 的功能，把 cookie/session 功能關掉，不管理它
router.post('/api/signin', passport.authenticate('local', { session: false }), userController.signIn) // 注意是 post

router.use('/', apiErrorHandler)

module.exports = router
