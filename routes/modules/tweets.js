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

// 新增回覆 POST /tweets/:tweetId/replies
router.post('/:tweetId/replies', validate(reply), tweetController.postReply)

// 瀏覽 GET /tweets/:tweetId/replies
router.get('/:tweetId/replies', tweetController.getReplies)

// POST /tweets/:tweetId/like  喜歡一則推文
router.post('/:tweetId/like', tweetController.addLike)

// POST /tweets/:tweetId/unlike 取消喜歡
router.post('/:tweetId/unlike', tweetController.removeLike)

module.exports = router
