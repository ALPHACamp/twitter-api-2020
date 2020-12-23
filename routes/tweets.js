const express = require('express')
const router = express.Router()

const tweetController = require('../controllers/tweetController')
const replyController = require('../controllers/replyController')
const likeController = require('../controllers/likeController')
const { authUserSelf } = require('../middleware/auth')

// routes for tweets
router.get('/', tweetController.readTweets)
router.post('/', tweetController.postTweet)
router.get('/:id', tweetController.readTweet)
router.put('/:id', tweetController.updateTweet)
router.delete('/:id', tweetController.deleteTweet)
// routes for replies
router.get('/:id/replies', replyController.readReplies)
router.post('/:id/replies', replyController.postReply)
router.put('/:tweetId/replies/:replyId', replyController.updateReply)
router.delete('/:tweetId/replies/:replyId', replyController.deleteReply)
// routes for likes
router.post('/:id/like', likeController.like)
router.post('/:id/unlike', likeController.unlike)

module.exports = router
