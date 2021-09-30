const express = require('express')
const router = express.Router()
const chatroomController = require('../../controllers/chatroomController.js')


router.get('/getHistoryMsg', chatroomController.getHistoryMsg)
router.get('/:userId/getPrivateChatMember', chatroomController.getPrivateChatMember)