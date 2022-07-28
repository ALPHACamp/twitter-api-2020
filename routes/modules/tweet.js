const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweet-controller')
const replyController = require('../../controllers/reply-controller')

router.get('/', tweetController.getTweets)
router.post('/', tweetController.createTweet)
router.get('/:id', tweetController.getTweet)
router.post('/:id/replies', replyController.postReply)
router.get('/:id/replies', tweetController.getReplies)
router.post('/:id/like', tweetController.addLike)
router.post('/:id/unlike', tweetController.removeLike)

module.exports = router
