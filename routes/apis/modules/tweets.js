const express = require('express')
const router = express.Router()
const tweetController = require('../../../controllers/apis/tweet-controller')

router.post('/:tweetId/replies', tweetController.replyTweet)
router.get('/:tweetId/replies', tweetController.getTweetReplies)
router.get('/:tweetId', tweetController.getTweet)
router.get('/', tweetController.getTweets)
router.post('/', tweetController.postTweet)

module.exports = router
