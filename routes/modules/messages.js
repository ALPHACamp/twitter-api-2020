const express = require('express')
const router = express.Router()

const messageController = require('../../controllers/messageController')

router.get('/users/:id/messaged', messageController.getChattedUsers)
router.get('/', messageController.getMessages)

module.exports = router