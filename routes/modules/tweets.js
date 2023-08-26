const express = require('express')
const router = express.Router()

const tweetController = require('../../controllers/tweet-controller')

router.get('/:id/replies', tweetController.getReplies)
router.post('/:id/replies', tweetController.postReply)
router.get('/:id', tweetController.getTweet)

router.post('/:id/like', tweetController.addLike)
router.post('/:id/unlike', tweetController.removeLike)

router.post('/', tweetController.postTweet)
router.get('/', tweetController.getTweets)

module.exports = router
