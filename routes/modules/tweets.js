const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweetController')
const replyController = require('../../controllers/replyController')
const likeController = require('../../controllers/likeController')

router.get('/', tweetController.getTweets)
router.post('/', tweetController.postTweet)
router.get('/:tweetId', tweetController.getTweet)
router.get('/:tweetId/replies', replyController.getReplies)
router.post('/:tweetId/replies', replyController.postReply)
router.post('/:tweetId/like', likeController.likeTweet)

module.exports = router
