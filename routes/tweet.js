const express = require('express')
const router = express.Router()
const tweetController = require('../controllers/tweetController')

router.post('/:tweet_id/replies', tweetController.postReply)
router.get('/:tweet_id', tweetController.getTweet)
router.post('/', tweetController.postTweet)

module.exports = router