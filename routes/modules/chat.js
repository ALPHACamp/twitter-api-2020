const express = require('express')
const router = express.Router()
const chatController = require('../../controllers/chatController')

router.get('/public', chatController.getPublicChat)

module.exports = router
