const express = require('express')
const validate = require('../../middleware/validate')
const { tweet, reply } = require('../../libs/schema')
const router = express.Router()
const tweetController = require('../../controllers/tweetController')

// 新增推文 - POST /tweets
// post('/api/tweets')
router.post('/', validate(tweet), tweetController.postTweet)

// GET /tweets - 所有推文，包括推文作者
// get('/api/tweets')
router.get('/', tweetController.getTweets)

// GET /tweets/:tweetId - 一筆推文與回覆
// get('/api/tweets/1')
router.get('/:tweetId', tweetController.getTweet)

// 新增回覆 POST /tweets/:tweet_id/replies
router.post('/:tweet_id/replies', validate(reply), tweetController.postReply)

// 瀏覽 GET /tweets/:tweet_id/replies
router.get('/:tweet_id/replies', tweetController.getReplies)

// POST /tweets/:tweet_id/like  喜歡一則推文
router.post('/:tweet_id/like', tweetController.addLike)

// POST /tweets/:tweet_id/unlike 取消喜歡
router.post('/:tweet_id/unlike', tweetController.removeLike)

module.exports = router
