const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweetController')
const replyController = require('../../controllers/replyController')

router.get('/', tweetController.getTweets)
router.post('/', tweetController.postTweet)
router.get('/:tweetId', tweetController.getTweet)
router.get('/:tweetId/replies', replyController.getReplies)

module.exports = router
