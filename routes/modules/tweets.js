const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweet-controller')
const likeController = require('../../controllers/like-controller')
const replyController = require('../../controllers/reply-controller')

router.post('/:id/like', likeController.postTweetLike)
router.post('/:id/unlike', likeController.postTweetUnlike)
router.get('/:id/replies', replyController.getReplies)
router.post('/:id/replies', replyController.postReplies)

// router.get('/:id', tweetController.getTweet)
// router.get('/', tweetController.getTweets)
// router.post('/', tweetController.postTweets)

module.exports = router

// GET /api/tweets 取得所有 Tweet
// POST /api/tweets 發佈一則 Tweet
// GET /api/tweets/:id 取得特定一則 Tweet 內容 (測試未出現)
// DELETE /api/tweets/:id 刪除 Tweet (測試未出現)
// PUT /api/tweets/:id 修改 Tweet (測試未出現)

// LIKE
// POST /api/tweets/:id/like like Tweet
// POST /api/tweets/:id/unlike Unlike Tweet

// REPLY
// GET /api/tweets/:tweet_id/replies 取得特定一則 Tweet 的所有回覆
// POST /api/tweets/:tweet_id/replies 回覆特定一則 Tweet
