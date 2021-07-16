const express = require('express')
const router = express.Router()

const chatController = require('../../controllers/chatController')

router.get('/')
router.get('/:room')
router.post('/')

module.exports = router
