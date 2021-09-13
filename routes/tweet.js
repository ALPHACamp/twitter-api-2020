const express = require('express')
const router = express.Router()
const tweetController = require('../controllers/tweetController')
const replyController = require('../controllers/replyController')

router.post('/:tweet_id/replies', tweetController.postReply)
router.get('/:tweet_id/replies', replyController.getTweetReplies)
router.get('/:tweet_id', tweetController.getTweet)
router.post('/', tweetController.postTweet)

module.exports = router