const express = require('express')
const router = express.Router()

const tweetController = require('../../controllers/tweet-controller')

// 取得全部貼文
router.get('/', tweetController.getTweets)
// 取得特定貼文
router.get('/:tweetId', tweetController.getTweet)

module.exports = router
