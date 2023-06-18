const express = require('express')
const router = express.Router()
const tweetController = require('../../../controllers/apis/tweet-controller')

router.get('/:tweet_id/replies', tweetController.getTweetReplies)
router.post('/:tweet_id/replies', tweetController.postTweetReplies)
router.post('/:id/like', tweetController.postTweetLike)
router.post('/:id/unlike', tweetController.postTweetUnlike)
router.get('/:tweet_id', tweetController.getTweet)
router.get('/', tweetController.getTweets)
router.post('/', tweetController.postTweet)

module.exports = router
