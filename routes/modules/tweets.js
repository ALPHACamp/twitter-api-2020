const express = require('express')
const router = express.Router()

const tweetController = require('../../controllers/tweet-controller')

router.get('/:tweetId/replies', tweetController.getReplies)
router.post('/:tweetId/replies', tweetController.postReplies)
router.post('/:tweetId/like', tweetController.postLike)
router.post('/:tweetId/unlike', tweetController.postUnlike)
router.get('/:tweetId', tweetController.getTweet)
router.delete('/:tweetId', tweetController.deleteTweet)
router.post('/', tweetController.postTweet)
router.get('/', tweetController.getTweets)

module.exports = router
