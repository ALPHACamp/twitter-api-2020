const express = require('express')
const router = express.Router()
const chatController = require('../../controllers/chatController')

router.get('/public', chatController.getPublicChat)
router.get('/public/online-users', chatController.getPublicOnlineUsers)

module.exports = router
