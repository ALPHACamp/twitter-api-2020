const express = require('express')
const router = express.Router()

const tweetController = require('../../../controllers/tweet-controller.js')

// 留言ＡＰＩ區塊
router.post('/:tweet_id/replies', tweetController.postReply) // 在推文新增一筆回覆
router.get('/:tweet_id/replies', tweetController.getReplies) // 瀏覽推文所有留言

// 推文ＡＰＩ區塊
router.post('/:id/like', tweetController.likeTweet)
router.post('/:id/unlike', tweetController.unlikeTweet)
router.get('/:tweet_id', tweetController.getTweet) // 瀏覽一筆貼文
router.get('/', tweetController.getTweets) // 瀏覽全部貼文
router.post('/', tweetController.postTweet) // 新增一筆貼文

module.exports = router
