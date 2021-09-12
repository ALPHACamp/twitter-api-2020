const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweetController')

// Get all tweets
router.get('/', tweetController.getTweets)
router.get('/:tweetId', tweetController.getTweet)
module.exports = router
