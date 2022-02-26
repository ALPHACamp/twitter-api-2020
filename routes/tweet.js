const express = require('express')
const router = express.Router()
const tweetController = require('../controllers/tweet-controller')
const replyController = require('../controllers/reply-controller')
const likeController = require('../controllers/like-controller')


router.post('/:id/replies', replyController.postReply)
router.get('/:id/replies', replyController.getReplies)
router.get('/:tweetId', tweetController.getTweet)
router.put('/:tweetId', tweetController.putTweet)
router.post('/:tweetId/like', likeController.likeTweet)
router.post('/:tweetId/unlike', likeController.unlikeTweet)
router.post('/', tweetController.postTweet)
router.get('/', tweetController.getTweets)


module.exports = router