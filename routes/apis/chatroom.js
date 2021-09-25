const express = require('express')
const router = express.Router()
const chatroomController = require('../../controllers/chatroomController.js')


router.get('/public', chatroomController.publicChat)



module.exports = router