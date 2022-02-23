const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweet-controller')

router.get('/', tweetController.getTweets)
router.post('/', tweetController.postTweets)
router.post('/:id/like', tweetController.likeTweet)
router.get('/:id', tweetController.getTweet)

module.exports = router
