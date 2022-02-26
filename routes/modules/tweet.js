// 引入模組
const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweet-controller')
const likeController = require('../../controllers/like-controller')

// tweet相關路由
router.post('/:id/like', likeController.likeTweet)
router.post('/:id/unlike', likeController.unlikeTweet)
router.get('/:tweet_id', tweetController.getTweet)
router.post('/', tweetController.postTweet)
router.get('/', tweetController.getTweets)

// 匯出模組
module.exports = router