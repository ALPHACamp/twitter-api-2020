const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweet-controller')

router.delete(':id', tweetController.deleteTweet)
router.post('/:id/like', tweetController.addTweetLike)
router.post('/:id/unlike', tweetController.deleteTweetLike)
router.get('/:tweet_id/replies', tweetController.getTweetReplies)
router.post('/', tweetController.addTweet)
router.get('/:id', tweetController.getTweet)

module.exports = router
