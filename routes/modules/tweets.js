const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweetController')
const { authenticated } = require('../../middleware/auth')

router.get('/', tweetController.getTweets)
router.get('/:tweet_id', tweetController.getTweet)
router.post('/', tweetController.postTweet)

//Reply
router.get('/:tweet_id/reply', tweetController.getReplies)
router.post('/:tweet_id/reply', tweetController.postReply)


module.exports = router