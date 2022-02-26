const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const tweetController = require('../../controllers/tweet-controller')
const replyController = require('../../controllers/reply-controller')
const { authenticated, authenticatedAdmin } = require('../../middleware/auth')

router.get('/:id', authenticated, tweetController.getTweet)
router.post('/', authenticated, tweetController.postTweet)
router.get('/', authenticated, tweetController.getTweets)

router.get('/:id/replies', authenticated, replyController.getTweetReplies)
router.post('/:id/replies', authenticated, replyController.postTweetReplies)
router.post('/:id/like', authenticated, userController.postLike)
router.post('/:id/unlike', authenticated, userController.postUnlike)

module.exports = router