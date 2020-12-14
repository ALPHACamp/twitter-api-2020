const express = require('express')
const router = express.Router()

const tweetController = require('../controllers/tweetController')
const replyController = require('../controllers/replyController')
const likeController = require('../controllers/likeController')

// routes for tweets
router.get('/', tweetController.readTweets)
router.post('/', tweetController.postTweet)
// routes for replies
router.get('/:id/replies', replyController.readReplies)
router.post('/:id/replies', replyController.postReply)
// routes for likes
router.post('/:id/like', likeController.like)
router.post('/:id/unlike', likeController.unlike)

module.exports = router
