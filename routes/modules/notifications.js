const express = require('express')
const router = express.Router()

const notificationController = require('../../controllers/notificationController')

router.post('/', notificationController.addNotification)
router.get('/:id', notificationController.getNotifications)
router.get('/:id/unread', notificationController.searchUnread)
router.put('/:id/unread', notificationController.clearUnread)

module.exports = router
