const express = require('express')
const router = express.Router()
const replyController = require('../../controllers/reply-controller')

router.put('/:id', replyController.editReply)

module.exports = router
