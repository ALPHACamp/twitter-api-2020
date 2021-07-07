const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweetController')
const { authenticated } = require('../../middleware/auth')

router.get('/', tweetController.getTweets)
router.get('/:tweet_id', tweetController.getTweet)
router.post('/', tweetController.postTweet)


module.exports = router