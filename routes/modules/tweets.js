const express = require('express')
const router = express.Router()

const tweetController = require('../../controllers/tweet-controller')

router.get('/:tweetId/replies', tweetController.getReplies)
router.get('/:tweetId', tweetController.getTweet)
router.delete('/:tweetId', tweetController.deleteTweet)
router.post('/', tweetController.postTweet)
router.get('/', tweetController.getTweets)

module.exports = router
