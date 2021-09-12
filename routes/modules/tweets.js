const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweetController')

// Get all tweets
router.get('/', tweetController.getTweets)
router.post('/', tweetController.postTweet)
router.post('/:tweetId/like', tweetController.postLikeTweet)
router.post('/:tweetId/unlike', tweetController.postUnlikeTweet)
router.get('/:tweetId', tweetController.getTweet)
router.get('/:tweetId/replies', tweetController.getTweetAllReplies)
module.exports = router
