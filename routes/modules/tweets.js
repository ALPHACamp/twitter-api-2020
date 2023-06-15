// user routes
const express = require('express')
const router = express.Router()
// import controller
const tweetController = require('../../controllers/tweet-controller')
const replyController = require('../../controllers/reply-controller')
const likeController = require('../../controllers/like-controller')
// import auth
const {
  authenticated,
  authenticatedUser
} = require('../../middleware/api-auth')

// tweets
router.get('/:tweet_id', authenticated, authenticatedUser, tweetController.getTweet)
router.get('/', authenticated, authenticatedUser, tweetController.getTweets)
router.post('/', authenticated, authenticatedUser, tweetController.postTweets)

// replies
router.get('/:tweet_id/replies', authenticated, authenticatedUser, replyController.getTweetReply)
router.post('/:tweet_id/replies', authenticated, authenticatedUser, replyController.postTweetReply)

// likes
router.post('/:id/like', authenticated, authenticatedUser, likeController.postTweetLike)
router.post('/:id/unlike', authenticated, authenticatedUser, likeController.postTweetUnlike)

module.exports = router
