const express = require('express')
const router = express.Router()

const roomController = require('../../controllers/roomController')

router
  .route('/')
  .post(roomController.createRoom)
  .get(roomController.getRoomsByUser)
router.route('/availableUsers').get(roomController.getAvailableUsers)
router.route('/notifications').get(roomController.getNotifications)
router.route('/private/unread').get(roomController.countUnreadMsg)
router.route('/:roomId').get(roomController.getRoom)

module.exports = router
