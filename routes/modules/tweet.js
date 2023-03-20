const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweet-controller')

router.get('/:id/replies', tweetController.getReplies)
router.post('/:id/replies', tweetController.postReply)
router.post('/:id/like', tweetController.postLike)
router.post('/:id/unlike', tweetController.postUnLike)
router.get('/:id', tweetController.getTweet)
router.get('/', tweetController.getTweets)
router.post('/', tweetController.postTweet)

module.exports = router
