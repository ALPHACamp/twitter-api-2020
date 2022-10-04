const express = require('express')
const router = express.Router()

const tweetController = require('../../../controllers/tweet-controller.js')

router.get('/:tweet_id', tweetController.getTweet) // 瀏覽一筆貼文
router.get('/', tweetController.getTweets) // 瀏覽全部貼文
router.post('/', tweetController.postTweet) // 新增一筆貼文
router.post('/:id/like', tweetController.likeTweet)

module.exports = router
