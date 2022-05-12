const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweet-controller')

// setting routes
router.get('/', tweetController.getTweets)
router.post('/', tweetController.postTweet)
router.get('/:id', tweetController.getTweet)
router.post('/:id/replies', tweetController.postReply)

module.exports = router
