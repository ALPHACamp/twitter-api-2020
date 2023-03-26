const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweet-controller')

router.get('/:tweetId', tweetController.getTweet)
router.post('/:tweetId/replies', tweetController.postReply)
router.get('/:tweetId/replies', tweetController.getReplies)
router.post('/:tweetId/like', tweetController.likeTweet)
router.post('/:tweetId/unlike', tweetController.unlikeTweet)
router.get('/', tweetController.getTweets)
router.post('/', tweetController.postTweet)
module.exports = router
