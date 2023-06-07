const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')

// 查看使用者資料
router.get('/:id', userController.getUser)
// 獲取使用者所寫過的推文資料
router.get('/:id/tweets', userController.getUserTweets)
module.exports = router
