const express = require('express')
const router = express.Router()
const tweetController = require('../../../controllers/apis/tweet-controller')

router.get('/', tweetController.getTweets)
router.post('/', tweetController.postTweet)

module.exports = router
