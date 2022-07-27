const express = require('express')
const router = express.Router()
const replyController = require('../../controllers/reply-controller')

router.put('/:id', replyController.editReply)
router.delete('/:id', replyController.deleteReply)

module.exports = router
