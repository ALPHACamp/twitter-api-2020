const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
// 管理者查看所有使用者清單
router.get('/users', adminController.getUsers)
// 管理者查看所有貼文
router.get('/tweets', adminController.getTweets)
module.exports = router
