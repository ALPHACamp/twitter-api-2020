const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweet-controller')

router.get('/', tweetController.getTweets)
router.post('/', tweetController.addOneTweet)
router.get('/:tweet_id', tweetController.getOneTweet)
router.get('/:tweet_id/replies', tweetController.getReplies)
router.post('/:tweet_id/replies', tweetController.addReply)
router.post('/:tweet_id/like', tweetController.likeOneTweet)
router.post('/:tweet_id/unlike', tweetController.unlikeOneTweet)
module.exports = router
