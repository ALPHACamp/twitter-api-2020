const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')

// 刪除單一推文
router.delete('/tweets/:id', adminController.deleteTweet)
// 顯示所有推文
router.get('/tweets', adminController.getTweets)
// 取得 user 資料
router.get('/users', adminController.getUsers)

module.exports = router
