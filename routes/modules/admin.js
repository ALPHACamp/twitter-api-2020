const express = require('express')
const adminController = require('../../controllers/admin-controller')
const router = express.Router()

// 管理員能夠刪除貼文
router.delete('/tweets/:id', adminController.deleteTweet)

module.exports = router
