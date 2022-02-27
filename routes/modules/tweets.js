const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweet-controller')
const replyController = require('../../controllers/reply-controller')
const likeController = require('../../controllers/like-controller')
const { authenticated } = require('../../middleware/auth')

router.get('/:id', authenticated, tweetController.getTweet)
router.post('/', authenticated, tweetController.postTweet)
router.get('/', authenticated, tweetController.getTweets)

router.get('/:id/replies', authenticated, replyController.getTweetReplies)
router.post('/:id/replies', authenticated, replyController.postTweetReplies)
router.post('/:id/like', authenticated, likeController.postTweetLike)
router.post('/:id/unlike', authenticated, likeController.postTweetUnlike)

module.exports = router