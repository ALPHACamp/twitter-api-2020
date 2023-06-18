const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweet-controller')

router.post('/:id/like', tweetController.postTweetLike)
router.post('/:id/unlike', tweetController.postTweetUnlike)
router.post('/:id/replies', tweetController.postTweetReplies)
router.get('/:id/replies', tweetController.getTweetReplies)
router.get('/:id', tweetController.getTweet)
router.get('/', tweetController.getTweets)
router.post('/', tweetController.postTweet)

module.exports = router
