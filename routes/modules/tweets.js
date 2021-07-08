const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweetController')
const { authenticated } = require('../../middleware/auth')

router.get('/', tweetController.getTweets)
router.get('/:tweet_id', tweetController.getTweet)
router.post('/', tweetController.postTweet)

// Reply
router.get('/:tweet_id/replies', tweetController.getReplies)
router.post('/:tweet_id/replies', tweetController.postReply)

// Like
router.post('/:id/like', tweetController.postLike)
router.post('/:id/unlike', tweetController.postUnlike)

module.exports = router
