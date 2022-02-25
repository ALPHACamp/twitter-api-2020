const express = require('express')
const router = express.Router()
const { authenticated } = require('../../../middleware/api-auth')
const tweetController = require('../../../controllers/apis/tweet-controllers')
const replyController = require('../../../controllers/apis/reply-controllers')

router.post('/:tweet_id/replies', authenticated, replyController.postReply)
router.get('/:tweet_id/replies', authenticated, replyController.getReplies)
router.get('/:tweet_id', authenticated, tweetController.getTweet)
router.post('/', authenticated, tweetController.postTweet)
router.get('/', authenticated, tweetController.getTweets)

module.exports = router
