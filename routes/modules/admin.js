const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')

// 登入
router.post('/login', adminController.login)
// 取得所有使用者
router.get('/users', adminController.getUsers)
// 取得所有推文
router.get('/tweets', adminController.getTweets)

module.exports = router
