const express = require('express')
const router = express.Router()
const tweetController = require('../controllers/tweetController')
const helpers = require('../_helpers')

router.get('/', helpers.authenticated, helpers.authenticatedUser, tweetController.getTweets)

router.post('/', helpers.authenticated, helpers.authenticatedUser, tweetController.postTweet)

router.get('/:TweetId', helpers.authenticated, helpers.authenticatedUser, tweetController.getTweet)

router.get('/:TweetId/replies', helpers.authenticated, helpers.authenticatedUser, tweetController.getTweetReplies)

router.post('/:TweetId/like', helpers.authenticated, helpers.authenticatedUser, tweetController.likeTweet)

router.post('/:TweetId/unlike', helpers.authenticated, helpers.authenticatedUser, tweetController.unlikeTweet)

router.post('/:TweetId/replies', helpers.authenticated, helpers.authenticatedUser, tweetController.postReply)

module.exports = router