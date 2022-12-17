const express = require('express')
const router = express.Router()

const tweetController = require('../../controllers/tweetController')

router.get('/:tweet_id', tweetController.getTweet)
router.get('/', tweetController.getTweets)
router.post('/', tweetController.postTweet)
module.exports = router
