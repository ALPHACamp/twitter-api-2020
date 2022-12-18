const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweet-controller')

router.post('/', tweetController.postTweet)
router.get('/', tweetController.getTweets)
router.get('/:tweet_id', tweetController.getTweet)

module.exports = router
