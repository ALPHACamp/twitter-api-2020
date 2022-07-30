const express = require('express')
const router = express.Router()

const tweetController = require('../../controllers/tweet-controller')
const likeController = require('../../controllers/like-controller')

router.get('/:id', tweetController.getTweet)
router.get('/', tweetController.getTweets)
router.post('/', tweetController.postTweet)

router.post('/:id/like', likeController.addLike)

module.exports = router
