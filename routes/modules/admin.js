
const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')

// admin相關路由
router.post('/signin', adminController.signIn) // No.20 - 登入後台帳號
router.get('/users', adminController.getUsers) // No.21 - 取得所有使用者清單
router.get('/tweets', adminController.getTweets) // No.22 - 取得所有推文清單
router.delete('/tweets/:id', adminController.deleteTweet) // No.23 - 刪除特定推文

module.exports = router
