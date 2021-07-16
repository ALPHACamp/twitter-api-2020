const express = require('express')
const router = express.Router()

const chatController = require('../../controllers/chatController')

router.get('/', chatController.joinPublicChat)

module.exports = router
