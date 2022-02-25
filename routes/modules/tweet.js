const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweet-controller')


router.post('/', tweetController.postTweet)
router.get('/:TweetId/replies', tweetController.getReplies)
router.get('/:TweetId', tweetController.getTweet)
router.get('/', tweetController.getTweets)


module.exports = router