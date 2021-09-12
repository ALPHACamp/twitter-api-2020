const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweetController')

// Get all tweets
router.get('/', tweetController.getTweets)
router.post('/', tweetController.postTweet)
router.post('/:tweetId/like', tweetController.postLikeTweet)
router.get('/:tweetId', tweetController.getTweet)
module.exports = router
