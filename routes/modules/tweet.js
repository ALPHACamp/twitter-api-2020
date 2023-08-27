const express = require('express')
const router = express.Router()

const tweetController = require('../../controllers/tweet-controller')

// 取得特定推文
router.get('/:tweetId', tweetController.getTweet)
// 取得全部推文
router.get('/', tweetController.getTweets)
// 發佈推文
router.post('/', tweetController.postTweet)

module.exports = router
