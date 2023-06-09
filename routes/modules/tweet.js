const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweet-controller')

// 瀏覽推文的所有回應
router.get('/:tweet_id/replies', tweetController.tweetReplies)
// 按讚推文
router.post('/:tweet_id/like', tweetController.addTweetLike)
// 取消按讚推文
router.post('/:tweet_id/unlike', tweetController.removeTweetLike)
// 查看一篇推文
router.get('/:tweet_id', tweetController.getTweet)
// 新增推文(tweet)
router.get('/', tweetController.getTweets)
router.post('/', tweetController.postTweet)
module.exports = router
