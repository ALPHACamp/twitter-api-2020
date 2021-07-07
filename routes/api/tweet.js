const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/api/tweetController')
const replyController = require('../../controllers/api/replyController')
const likeController = require('../../controllers/api/likeController')

router.get('/', tweetController.getTweets)
router.post('/', tweetController.postTweet)
router.get('/:tweetId', tweetController.getTweet)
router.get('/:tweetId/replies', replyController.getReplies)
router.post('/:tweetId/replies', replyController.postReply)
router.get('/:tweetId/like', likeController.getLikes)

module.exports = router
