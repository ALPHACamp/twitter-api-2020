const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweet-controller')
// 查看貼文的回覆
router.get('/:tweet_id/replies', tweetController.getReplies)
// 新增一筆回覆
router.post('/:tweet_id/replies', tweetController.postReply)
// like 一則貼文
router.post('/:id/like', tweetController.likeTweet)
// unlike一則貼文
router.post('/:id/unlike', tweetController.unlikeTweet)
// 瀏覽貼文
router.get('/:tweet_id', tweetController.getTweet)
// 新增一筆貼文
router.post('/', tweetController.postTweet)
// 瀏覽所有貼文
router.get('/', tweetController.getTweets)

module.exports = router
