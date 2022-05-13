const express = require('express')
const router = express.Router()
const replyController = require('../../controllers/reply-controller')

// setting routes
router.post('/replies/:id/like', replyController.likeReply)
router.post('/replies/:id/like', replyController.unlikeReply)

module.exports = router
