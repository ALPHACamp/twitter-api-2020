const express = require('express')
const router = express.Router()

const roomController = require('../../controllers/roomController')

router.route('/').post(roomController.createRoom)
router.route('/public/messages').post(roomController.sendPublicMessage)
router.route('/:roomId/messages').post(roomController.sendMessage)

module.exports = router
