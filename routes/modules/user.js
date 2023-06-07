const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')

// 獲取使用者資料及其推文
router.get('/:id/tweets', userController.getUserTweets)
module.exports = router
