const express = require('express')
const router = express.Router()

const { authenticatedUser } = require('../../middleware/auth')
const tweetController = require('../../controllers/tweetController')

router.route('/')
  .get(tweetController.getTweets)
  .post(authenticatedUser, tweetController.postTweets)
router.route('/:tweet_id')
  .get(tweetController.getTweet)
  .delete(authenticatedUser, tweetController.deleteTweet)
  .put(authenticatedUser, tweetController.editTweet)
router.route('/:tweet_id/like')
  .post(authenticatedUser, tweetController.likeTweet)
  .delete(authenticatedUser, tweetController.unlikeTweet)
router.route('/:tweet_id/replies')
  .post(authenticatedUser, tweetController.postReply)
  .get(tweetController.getReplies)
router.route('/:tweet_id/replies/:reply_id')
  .put(authenticatedUser, tweetController.editReply)
  .delete(authenticatedUser, tweetController.deleteReply)

module.exports = router
