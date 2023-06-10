const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweet-controller')

// 新增回應（reply)
router.post('/:tweet_id/replies', tweetController.postReply)
// 按讚推文
router.post('/:tweet_id/like', tweetController.addTweetLike)
// 取消按讚推文
router.post('/:tweet_id/unlike', tweetController.removeTweetLike)
// 新增推文(tweet)
router.post('/', tweetController.postTweet)
// 瀏覽推文的所有回應
router.get('/:tweet_id/replies', tweetController.tweetReplies)
// 查看一篇推文
router.get('/:tweet_id', tweetController.getTweet)
// 瀏覽所有推文
router.get('/', tweetController.getTweets)

module.exports = router
