const express = require('express')
const router = express.Router()

const tweetController = require('../../controllers/tweet-controller')

router.post('/:tweetId/replies', tweetController.postReply)
router.get('/:tweetId/replies', tweetController.getReplies)
router.get('/:tweetId', tweetController.getTweet)
router.get('/', tweetController.getTweets)
router.post('/', tweetController.postTweet)

module.exports = router
