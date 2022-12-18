const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweet-controller')
// 查看貼文的回覆
router.get('/:tweet_id/replies', tweetController.getReplies)
router.get('/:tweet_id', tweetController.getTweet)
router.post('/', tweetController.postTweet)
router.get('/', tweetController.getTweets)

module.exports = router
