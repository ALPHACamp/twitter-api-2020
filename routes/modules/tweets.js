const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweet-controller')

router.get('/:tweet_id/replies', tweetController.getTweetReplies)
router.post('/:tweet_id/replies', tweetController.postTweetReplies)
router.get('/:id', tweetController.getTweet)
router.get('/', tweetController.getTweets)
router.post('/', tweetController.postTweet)

module.exports = router
