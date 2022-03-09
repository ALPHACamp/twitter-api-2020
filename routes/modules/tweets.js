const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweetController')

// Get all tweets
router.get('/', tweetController.getTweets)

// Create a tweet
router.post('/', tweetController.postTweet)

// Like tweet_id's tweet
router.post('/:tweetId/like', tweetController.postLikeTweet)

// Unlike tweet_id's tweet
router.post('/:tweetId/unlike', tweetController.postUnlikeTweet)

// Get tweet_id's tweets and replies
router.get('/:tweetId', tweetController.getTweet)

// Get tweet_id's replies
// FIXME: This API is not currently used, consider removing it.
router.get('/:tweetId/replies', tweetController.getTweetAllReplies)

// Create tweet_id's reply
router.post('/:tweetId/replies', tweetController.postReply)

module.exports = router
