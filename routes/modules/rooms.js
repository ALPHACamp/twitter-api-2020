const express = require('express')
const router = express.Router()

const roomController = require('../../controllers/roomController')

router.route('/').post(roomController.createRoom).get(roomController.getRoomsByUser)
router.route('/availableUsers').get(roomController.getAvailableUsers)
router.route('/:roomId').get(roomController.getRoom)
router.route('/:roomId/messages').post(roomController.sendMessage)

module.exports = router
