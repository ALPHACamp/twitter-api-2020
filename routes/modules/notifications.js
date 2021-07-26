const express = require('express')
const router = express.Router()

const notificationController = require('../../controllers/notificationController')

router.post('/', notificationController.addNotification)
router.get('/:id', notificationController.getNotifications)

module.exports = router
