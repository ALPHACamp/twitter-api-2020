const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweet-controller')

router.get('/', tweetController.getTweets)
router.post('/', tweetController.postTweet)
router.get('/:id', tweetController.getTweet)
router.get('/:id/replies', tweetController.getTweetReplies)

module.exports = router

// POST	/api/tweets/:id/like	喜歡某則tweet
// POST	/api/tweets/:id/unlike	取消喜歡某則tweet
// POST	/api/tweets/:id/replies	新增回覆