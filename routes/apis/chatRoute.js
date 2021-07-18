const express = require('express')
const router = express.Router()

const chatController = require('../../controllers/chatController')

router.get('/', chatController.getHistoryChat)
router.get('/private', chatController.getPrivateChatList)
router.get('/:room_id', chatController.getPrivateChat)

module.exports = router
