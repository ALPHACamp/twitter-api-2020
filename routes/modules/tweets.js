const express = require('express')
const router = express.Router()

const tweetController = require('../../controllers/tweet-controllers')

router.get('/', tweetController.getTweets)
router.post('/', tweetController.postTweet)
router.post('/:id/like', tweetController.likeTweet)
router.get('/:tweet_id', tweetController.getTweet)

module.exports = router
