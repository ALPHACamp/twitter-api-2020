const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweet-controller')

router.get('/:tweet_id/replies', tweetController.getTweetReplies)

router.post('/:tweet_id/replies', tweetController.postTweetReply)

router.get('/:tweet_id', tweetController.getTweet)

router.post('/', tweetController.postTweet)

router.get('/', tweetController.getTweets)

module.exports = router
