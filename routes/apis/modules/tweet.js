const express = require('express')
const router = express.Router()
const replyController = require('../../../controllers/reply-controller')
const tweetController = require('../../../controllers/tweet-controller')
const likeController = require('../../../controllers/like-controller')

router.post('/:id/like', likeController.postTweetLike)
router.post('/:id/unlike', likeController.postTweetUnlike)
router.get('/:id/replies', replyController.getReplies)
router.post('/:id/replies', replyController.postReplies)
router.get('/', tweetController.getTweets)

module.exports = router
