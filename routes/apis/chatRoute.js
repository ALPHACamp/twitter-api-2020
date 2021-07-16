const express = require('express')
const router = express.Router()

const chatController = require('../../controllers/chatController')

router.get('/:room', chatController.getHistoryChat)

module.exports = router
