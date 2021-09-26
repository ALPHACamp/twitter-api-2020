const express = require('express')
const router = express.Router()
const socketController = require('../../controllers/socketController')

router.get('/privateMessages', socketController.getPrivateMessages)

router.get('/:roomId', socketController.getMessages)

module.exports = router
