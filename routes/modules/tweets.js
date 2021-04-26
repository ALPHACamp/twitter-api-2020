const express = require('express')
const router = express.Router()

const { authenticated } = require('../../middleware/auth')
const tweetController = require('../../controllers/tweetController')

router.get('/', tweetController.getTweets)
router.post('/', tweetController.postTweets)
router.get('/:tweet_id', tweetController.getTweet)
router.delete('/:tweet_id', tweetController.deleteTweet)
router.post('/:tweet_id/like', tweetController.likeTweet)
router.post('/:tweet_id/unlike', tweetController.unlikeTweet)
router.post('/:tweet_id/replies', tweetController.postReply)
router.get('/:tweet_id/replies', tweetController.getReplies)

module.exports = router
