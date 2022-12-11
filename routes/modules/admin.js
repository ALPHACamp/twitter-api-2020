const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const { authenticated, authenticatedAdmin } = require('../../middleware/auth')

// 登入
router.post('/login', adminController.login)
// 取得所有使用者
router.get('/users', authenticated, authenticatedAdmin, adminController.getUsers)
// 取得所有推文
router.get('/tweets', authenticated, authenticatedAdmin, adminController.getTweets)

module.exports = router
