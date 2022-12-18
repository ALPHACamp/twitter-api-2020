const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweet-controller')

// Reply
router.get('/:tweet_id/replies', tweetController.getReplies)
router.post('/:tweet_id/replies', tweetController.postReply)
// Like
router.post('/:id/like', tweetController.addLike)
router.post('/:id/unlike', tweetController.removeLike)
// Tweet
router.get('/:tweet_id', tweetController.getTweet)
router.get('/', tweetController.getTweets)
router.post('/', tweetController.postTweet)

module.exports = router
