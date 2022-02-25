const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweet-controller')
const replyController = require('../../controllers/reply-controller')
const { authenticated, authenticatedAdmin } = require('../../middleware/auth')

router.get('/', tweetController.getTweets)
router.post('/', tweetController.postTweet)

router.get('/:id/replies', authenticated, replyController.getReplies)
router.post('/:id/replies', authenticated, replyController.postReplies)
module.exports = router