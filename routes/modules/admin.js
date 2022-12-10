const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')

// 取得所有推文
router.get('/tweets', adminController.getTweets)
module.exports = router
