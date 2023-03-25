const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweet-controller')

router.post('/:tweet_id/replies', tweetController.postReply)
router.get('/:tweet_id/replies', tweetController.getReplies)
router.get('/:id', tweetController.getTweet)
router.post('/', tweetController.postTweet)
router.get('/', tweetController.getTweets)

module.exports = router
