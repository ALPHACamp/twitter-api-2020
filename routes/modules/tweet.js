const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweet-controller')

router.get('/', tweetController.getTweets)
router.post('/', tweetController.postTweets)

module.exports = router
