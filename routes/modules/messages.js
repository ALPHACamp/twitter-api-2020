const express = require('express')
const router = express.Router()
const messageController = require('../../controllers/messageController')

router.get('/latest_messages', messageController.getLatestMessages)
router.get('/private', messageController.getPrivateRooms)
router.get('/:RoomId', messageController.getMessages)

module.exports = router
