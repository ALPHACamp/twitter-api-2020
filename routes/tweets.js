const express = require('express')
const router = express.Router()

const tweetController = require('../controllers/tweetController')
const replyController = require('../controllers/replyController')
const likeController = require('../controllers/likeController')
const { authUserSelf } = require('../middleware/auth')

// routes for tweets
router.get('/', tweetController.readTweets)
router.post('/', tweetController.postTweet)
// routes for replies
router.get('/:id/replies', replyController.readReplies)
router.post('/:id/replies', authUserSelf, replyController.postReply)
// routes for likes
router.post('/:id/like', authUserSelf, likeController.like)
router.post('/:id/unlike', authUserSelf, likeController.unlike)

module.exports = router
