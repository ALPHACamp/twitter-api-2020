const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweet-controller')

router.get('/', tweetController.getTweets)
router.post('/', tweetController.postTweet)
router.get('/:id', tweetController.getTweet)
router.get('/:id/replies', tweetController.getTweetReplies)
router.post('/:id/replies', tweetController.postTweetReply)
router.post('/:id/like', tweetController.likeTweet)
router.post('/:id/unlike', tweetController.unlikeTweet)

module.exports = router
