const express = require('express')
const router = express.Router()

const tweetController = require('../../controllers/tweet-controller')
const likeController = require('../../controllers/like-controller')
const replyController = require('../../controllers/reply-controller')

router.post('/:id/like', likeController.postLikeToTweet)
router.post('/:id/unlike', likeController.postUnlikeToTweet)
router.get('/:tweet_id/replies', replyController.getReplies)
router.post('/:tweet_id/replies', replyController.postReply)
router.get('/:tweet_id', tweetController.getTweet)
router.get('/', tweetController.getTweets)
router.post('/', tweetController.postTweet)

module.exports = router
