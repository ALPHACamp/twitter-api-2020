const express = require('express')
const router = express.Router()
const tweetController = require('../controllers/tweetController')
const replyController = require('../controllers/replyController')
const likeController = require('../controllers/likeController')

router.post('/:tweet_id/replies', tweetController.postReply)
router.post('/:id/like', likeController.likeTweet)
router.post('/:id/unlike', likeController.unlikeTweet)
router.get('/:tweet_id/replies', replyController.getTweetReplies)
router.get('/:tweet_id', tweetController.getTweet)
router.put('/:tweet_id', tweetController.putTweet)
router.post('/', tweetController.postTweet)
router.get('/', tweetController.getTweets)

module.exports = router