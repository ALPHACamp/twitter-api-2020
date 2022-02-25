const express = require('express')
const router = express.Router()
const replyController = require('../../../controllers/reply-controller')
const likeController = require('../../../controllers/like-controller')

router.post('/:id/like', likeController.postTweetLike)
router.post('/:id/unlike', likeController.postTweetUnlike)
router.get('/:id/replies', replyController.getReplies)

module.exports = router
