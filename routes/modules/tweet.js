const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweet-controller')

const { userAuthenticated } = require('../../middleware/auth')

router.get('/:id/replies', userAuthenticated, tweetController.getTweetReplies)
router.post('/:id/replies', userAuthenticated, tweetController.postTweetReply)
router.post('/:id/like', userAuthenticated, tweetController.likeTweet)
router.post('/:id/unlike', userAuthenticated, tweetController.unlikeTweet)
router.get('/:id', userAuthenticated, tweetController.getTweet)
router.get('/', userAuthenticated, tweetController.getTweets)
router.post('/', userAuthenticated, tweetController.postTweets)

module.exports = router