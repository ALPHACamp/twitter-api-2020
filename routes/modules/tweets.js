const express = require('express')
const router = express.Router()

const tweetController = require('../../controllers/tweet-controllers')
const replyController = require('../../controllers/reply-controllers')


router.get('/:tweet_id/replies', replyController.getReplies)
router.post('/:tweet_id/replies', replyController.postReply)
router.post('/:id/unlike', tweetController.unlikeTweet)
router.post('/:id/like', tweetController.likeTweet)
router.get('/:tweet_id', tweetController.getTweet)
router.get('/', tweetController.getTweets)
router.post('/', tweetController.postTweet)

module.exports = router
