const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweetController')
const { authenticated, checkRole } = require('../../middleware/auth')

// 新增推文 - POST /tweets
// post('/api/tweets')
router.post('/', authenticated, checkRole(), tweetController.postTweet)

// GET /tweets - 所有推文，包括推文作者
// get('/api/tweets')
router.get('/', authenticated, checkRole(), tweetController.getTweets)

// GET /tweets/:tweet_id - 一筆推文與回覆
// get('/api/tweets/1')
router.get('/:tweet_id', authenticated, checkRole(), tweetController.getTweet)

module.exports = router
