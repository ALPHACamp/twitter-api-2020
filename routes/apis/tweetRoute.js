const express = require('express')
const router = express.Router()

const tweetController = require('../../controllers/tweetController')

router.get('/', tweetController.getTweets)
router.post('/', tweetController.postTweet)
router.get('/:tweet_id/replies', tweetController.getTweetAndReplies)
router.post('/:tweet_id/replies', tweetController.postReply)
router.post('/:tweet_id/like', tweetController.likeTweet)
router.post('/:tweet_id/unlike', tweetController.unlikeTweet)

module.exports = router
