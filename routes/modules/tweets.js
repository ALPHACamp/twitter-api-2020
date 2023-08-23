const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweet-controller')

router.get('/:tweet_id', tweetController.getTweet)

module.exports = router
