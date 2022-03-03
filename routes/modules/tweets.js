const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweet-controller')
const replyController = require('../../controllers/reply-controller')
const likeController = require('../../controllers/like-controller')
const { authenticated } = require('../../middleware/auth')

router.use(authenticated)
router.get('/', tweetController.getTweets)
router.post('/', tweetController.postTweet)
router.get('/:id', tweetController.getTweet)
router.get('/:id/replies', replyController.getReplies)
router.post('/:id/replies', replyController.postReplies)
router.post('/:id/like', likeController.postLike)
router.post('/:id/unlike', likeController.postUnlike)

module.exports = router