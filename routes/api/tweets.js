const express = require('express')
const router = express.Router()

const tweetController = require('../../controllers/api/tweetController')

router.get('/', tweetController.getTweets)
router.get('/:id', tweetController.getTweet)
router.get('/:id/replies', tweetController.getReplies)
// post a tweet
router.post('/', tweetController.postTweet)
// post a reply to a tweet
router.post('/:tweetId/replies', tweetController.postReply)
// like a post
router.post('/:tweetId/like', tweetController.likeTweet)
router.post('/:tweetId/unlike', tweetController.unlikeTweet)
module.exports = router
