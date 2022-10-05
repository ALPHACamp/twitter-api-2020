const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweet-controller')

router.get('/:tweet_id/replies', tweetController.getTweetReplies)
router.get('/:id', tweetController.getTweet)

module.exports = router
