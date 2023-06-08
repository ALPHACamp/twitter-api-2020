const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweet-controller')

// 新增回應（reply)
router.post('/:tweet_id/replies', tweetController.postReply)
// 查看一篇推文
router.get('/:tweet_id', tweetController.getTweet)
// 新增推文(tweet)
router.get('/', tweetController.getTweets)
router.post('/', tweetController.postTweet)
module.exports = router
