const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweetController')

// 新增推文 - POST /tweets
// post('/api/tweets')
router.post('/tweets', tweetController.postTweet)

// GET /tweets - 所有推文，包括推文作者
// get('/api/tweets')

// GET /tweets/:tweet_id - 一筆推文與回覆
// get('/api/tweets/1')

module.exports = router
