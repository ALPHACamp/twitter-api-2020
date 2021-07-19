const express = require('express')
const router = express.Router()

const messageController = require('../../controllers/messageController')

router.get('/', messageController.getMessages)
router.get('/users/{id}/messaged', messageController.getChattedUsers)

module.exports = router