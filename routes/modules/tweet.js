const express = require('express')
const router = express.Router()

const tweetController = require('../../controllers/tweet-controller')

router.post('/:id/unlike', tweetController.unlikeTweet)
router.post('/:id/like', tweetController.likeTweet)
router.get('/:id', tweetController.getTweet)
router.get('/', tweetController.getTweets)

module.exports = router
