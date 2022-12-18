const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweet-controller')

const { authenticated } = require('../../middleware/auth')

router.get('/:id/replies', authenticated, tweetController.getTweetReplies)
router.post('/:id/replies', authenticated, tweetController.postTweetReply)
router.post('/:id/like', authenticated, tweetController.likeTweet)
router.post('/:id/unlike', authenticated, tweetController.unlikeTweet)
router.get('/:id', authenticated, tweetController.getTweet)
router.get('/', authenticated, tweetController.getTweets)
router.post('/', authenticated, tweetController.postTweets)

module.exports = router