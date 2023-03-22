const express = require('express')
const router = express.Router()

const userController = require('../controllers/user-controller')
const passport = require('../config/passport')
const admin = require('./modules/admin')
const { authenticated, authenticatedAdmin, authenticatedUser } = require('../middleware/api-auth')
const { apiErrorHandler } = require('../middleware/error-handler')

router.use('/api/admin', authenticated, authenticatedAdmin, admin)
// router.get('/api/admin/restaurants', authenticated, apiErrorHandler)

router.get('/api/users/:id/tweets', authenticated, authenticatedUser, (req, res) => res.send('用戶認證 success'))

router.post('/api/users', userController.signUp) // 註冊帳號路由
// (下1) session: false 的功能，把 cookie/session 功能關掉，不管理它
router.post('/api/signin', passport.authenticate('local', { session: false }), userController.signIn) // 注意是 post

router.use('/', apiErrorHandler)

module.exports = router
