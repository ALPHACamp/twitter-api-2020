const express = require('express')
const router = express.Router()

const messageController = require('../../controllers/message-controller')

router.get('/public/:roomId', messageController.getMessages)

module.exports = router