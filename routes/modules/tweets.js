const express = require('express')
const router = express.Router()
const { authenticatedUser } = require('../../middleware/api-auth')
const tweetController = require('../../controllers/tweet-controller')

router.get('/:tweet_id/replies', authenticatedUser, tweetController.getTweetReplies)
router.post('/:tweet_id/replies', authenticatedUser, tweetController.replyTweet)

router.post('/:id/unlike', authenticatedUser, tweetController.unlikeTweet)
router.post('/:id/like', authenticatedUser, tweetController.likeTweet)
router.get('/:id', authenticatedUser, tweetController.getTweet)
router.post('/', authenticatedUser, tweetController.postTweet)
router.get('/', tweetController.getTweets) // user 跟 admin 共用同一條

module.exports = router
