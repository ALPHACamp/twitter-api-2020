const express = require('express')
const router = express.Router()
const { authenticated, authenticatedAdmin } = require('../../../middleware/api-auth')
const tweetController = require('../../../controllers/apis/tweet-controllers')

router.get('/:tweet_id', authenticated, tweetController.getTweet)
router.post('/', authenticated, tweetController.postTweet)
router.get('/', authenticated, tweetController.getTweets)

module.exports = router