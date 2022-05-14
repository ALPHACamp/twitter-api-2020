const express = require('express')
const router = express.Router()
const replyController = require('../../controllers/reply-controller')

// setting routes
router.put('/:id', replyController.putReply)
router.post('/:id/like', replyController.likeReply)
router.post('/:id/unlike', replyController.unlikeReply)

module.exports = router
