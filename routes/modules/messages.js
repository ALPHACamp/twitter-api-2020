const express = require('express')
const router = express.Router()
const messageController = require('../../controllers/messageController')

router.get('/:RoomId', messageController.getMessages)
router.get('/private', messageController.getPrivateRooms)

module.exports = router
