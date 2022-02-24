const express = require('express')
const router = express.Router()
const tweetController = require('../../../controllers/apis/tweet-controllers')

router.get('/:tweet_id', tweetController.getTweet)
router.get('/', tweetController.getTweets)

module.exports = router