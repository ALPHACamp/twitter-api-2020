const express = require('express')
const router = express.Router()

const { authenticatedUser } = require('../../middleware/auth')
const tweetController = require('../../controllers/tweetController')

router.get('/', tweetController.getTweets)
router.post('/', authenticatedUser, tweetController.postTweets)
router.get('/:tweet_id', tweetController.getTweet)
router.delete('/:tweet_id', authenticatedUser, tweetController.deleteTweet)
router.put('/:tweet_id', authenticatedUser, tweetController.editTweet)
router.post('/:tweet_id/like', authenticatedUser, tweetController.likeTweet)
router.post('/:tweet_id/unlike', authenticatedUser, tweetController.unlikeTweet)
router.post('/:tweet_id/replies', authenticatedUser, tweetController.postReply)
router.get('/:tweet_id/replies', tweetController.getReplies)
router.put(
  '/:tweet_id/replies/:reply_id',
  authenticatedUser,
  tweetController.editReply
)
router.delete(
  '/:tweet_id/replies/:reply_id',
  authenticatedUser,
  tweetController.deleteReply
)

module.exports = router
