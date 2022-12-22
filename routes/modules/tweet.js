const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweet-controller')
const { tweetValidator, replyValidator } = require('../../middleware/validator-handler')

router.get('/', tweetController.getTweets)
router.post('/', tweetValidator, tweetController.postTweet)
router.get('/:id', tweetController.getTweet)
router.get('/:id/replies', tweetController.getTweetReplies)
router.post('/:id/replies', replyValidator, tweetController.postTweetReply)
router.post('/:id/like', tweetController.likeTweet)
router.post('/:id/unlike', tweetController.unlikeTweet)

module.exports = router
