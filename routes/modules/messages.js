const express = require('express')
const router = express.Router()

const messageController = require('../../controllers/message-controller')

router.get('/privateMessages/:roomId', messageController.privateMessages)
router.get('/public', messageController.getMessages)

module.exports = router