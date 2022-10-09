const express = require('express')
const router = express.Router()
const { apiErrorHandler } = require('../../middleware/error-handler')
const { authenticated } = require('../../middleware/auth')
const tweetController = require('../../controllers/tweet-controller')

router.get('/:id/replies',  authenticated, tweetController.getReplies)
router.post('/:id/replies', authenticated, tweetController.postReply)
router.post('/:id/like', authenticated, tweetController.likeTweet)
router.post('/:id/unlike', authenticated, tweetController.unlikeTweet)
router.get('/:id', authenticated, tweetController.getTweet)
router.post('/', authenticated, tweetController.postTweet)
router.get('/', authenticated, tweetController.getTweets)

router.use('/', apiErrorHandler)

module.exports = router
