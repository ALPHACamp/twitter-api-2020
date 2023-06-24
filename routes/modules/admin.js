const express = require('express')
const adminController = require('../../controllers/admin-controller')
const router = express.Router()

// 管理員能夠刪除貼文
router.delete('/tweets/:id', adminController.deleteTweet)
// 取得所有推文及該推文使用者資料
router.get('/tweets', adminController.getTweets)
// 取得所有使用者資料
router.get('/users', adminController.getUsers)

module.exports = router
