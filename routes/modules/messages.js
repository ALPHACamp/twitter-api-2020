const express = require('express')
const router = express.Router()
const socketController = require('../../controllers/socketController')

router.get('/:roomId', socketController.getMessages)

router.get('/', socketController.getPrivateMessages)

module.exports = router
