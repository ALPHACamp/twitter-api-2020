const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweet-controller')

router.get('/:tweet_id', tweetController.getTweet)
router.put('/:id', tweetController.putTweet)
router.get('/:tweet_id/replies', tweetController.getReply)
router.post('/:tweet_id/replies', tweetController.postReply)
router.post('/:id/like', tweetController.postLike)
router.post('/:id/unlike', tweetController.postUnlike)
router.get('/', tweetController.getTweets)
router.post('/', tweetController.postTweet)

module.exports = router
