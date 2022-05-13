const express = require('express')
const router = express.Router()

const tweetController = require('../../controllers/tweet-controller')

router.get('/:id', tweetController.getTweet)
router.get('/', tweetController.getAllTweet)

router.post('/:id/like', tweetController.likeTweet)
router.post('/:id/unlike', tweetController.deleteLikeTweet)
router.post('/', tweetController.postTweet)

module.exports = router
