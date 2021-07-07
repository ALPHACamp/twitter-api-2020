const express = require('express')
const router = express.Router()
const tweetController = require('../controllers/tweetController')

router.get('/', tweetController.getTweets)

router.post('/', tweetController.postTweet)

router.get('/:TweetId', tweetController.getTweet)

router.get('/:TweetId/replies', tweetController.getTweetReplies)

router.post('/:TweetId/like', tweetController.likeTweet)

router.post('/:TweetId/unlike', tweetController.unlikeTweet)

router.post('/:TweetId/replies', tweetController.postReply)

module.exports = router