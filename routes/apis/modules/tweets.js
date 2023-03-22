const express = require('express')
const router = express.Router()

const tweetController = require('../../../controllers/tweet-controller')

router.get('/:tweetId/replies', tweetController.getReplies)
router.post('/:tweetId/replies', tweetController.postReply)
router.get('/:tweetId', tweetController.getTweet)

router.post('/tweetId/like', tweetController.addLike)
router.post('/tweetId/unlike', tweetController.removeLike)

router.post('/', tweetController.postTweet)
router.get('/', tweetController.getTweets)

module.exports = router
