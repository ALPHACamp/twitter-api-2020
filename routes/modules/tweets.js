const express = require('express')
const router = express.Router()

const tweetContorller = require('../../controllers/apis/tweet-controller')

router.get('/:tweet_id', tweetContorller.getTweet)
router.get('/', tweetContorller.getTweets)

module.exports = router
