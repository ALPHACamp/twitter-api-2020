const express = require('express')
const router = express.Router()
const socketController = require('../../controllers/socketController')

router.post('/:roomId', socketController.getMessages)

module.exports = router
