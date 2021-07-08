const express = require('express')
const router = express.Router()

const tweetController = require('../../controllers/tweetController')

router.post('/:id/replies', tweetController.postReply)
router.get('/:id', tweetController.getSingleTweet)
router.post('/', tweetController.postTweet)
router.get('/', tweetController.getTweets)

module.exports = router
