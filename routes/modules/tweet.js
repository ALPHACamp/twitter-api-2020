const express = require('express')
const router = express.Router()

const tweetController = require('../../controllers/tweet-controller')

router.get('/:id/replies', tweetController.getReplies)
router.get('/:id', tweetController.getTweet)
router.get('/', tweetController.getAllTweet)

router.post('/:id/replies', tweetController.postReply)
router.post('/:id/like', tweetController.likeTweet)
router.post('/:id/unlike', tweetController.deleteLikeTweet)
router.post('/', tweetController.postTweet)

module.exports = router
