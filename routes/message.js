const express = require('express')
const router = express.Router()
const messageController = require('../controllers/messageController')

router.get('/:roomId', messageController.getHistoryMessage)

module.exports = router