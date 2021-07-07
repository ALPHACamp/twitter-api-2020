const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/api/tweetController')
const replyController = require('../../controllers/api/replyController')

router.get('/', tweetController.getTweets)
router.post('/', tweetController.postTweet)
router.get('/:tweetId', tweetController.getTweet)
router.get('/:tweetId/replies', replyController.getReplies)
router.post('/:tweetId/replies', replyController.postReply)

module.exports = router
