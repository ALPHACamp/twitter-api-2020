const express = require('express')
const router = express.Router()
const { authenticated, authenticatedUser } = require('../../middleware/auth')
const tweetController = require('../../controllers/tweetController')

router.get('/', authenticated, tweetController.getTweets)
router.post('/', authenticated, authenticatedUser, tweetController.postTweet)
router.get('/:tweet_id', authenticated, authenticatedUser, tweetController.getTweet)
router.get('/:tweet_id/replies', authenticated, authenticatedUser, tweetController.getReplies)
router.post('/:tweet_id/replies', authenticated, authenticatedUser, tweetController.postReply)
router.post('/:tweet_id/like', authenticated, authenticatedUser, tweetController.addLike)
router.post('/:tweet_id/unlike', authenticated, authenticatedUser, tweetController.removeLike)

module.exports = router
