const express = require('express')
const adminController = require('../../controllers/admin-controller')
const router = express.Router()

// 取得所有推文及該推文使用者資料
router.get('/tweets', adminController.getTweets)

module.exports = router
