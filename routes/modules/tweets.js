const express = require('express')
const router = express.Router()

const tweetController = require('../../controllers/tweet-controller')
const userController = require('../../controllers/user-controller')

router.post('/:tweet_id/replies', tweetController.postReply)
router.get('/:tweet_id/replies', tweetController.getReply)

router.post('/:id/unlike', tweetController.removeLike)
router.post('/:id/like', tweetController.addLike)

router.get('/:tweet_id', tweetController.getTweet)
router.post('/', tweetController.postTweet)
router.get('/', tweetController.getTweets)

module.exports = router
