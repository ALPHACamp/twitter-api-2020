const express = require('express')
const router = express.Router()
const { apiErrorHandler } = require('../../middleware/error-handler')
const { authenticated } = require('../../middleware/auth')
const tweetController = require('../../controllers/tweet-controller')

router.get('/:id/replies', tweetController.getReplies)
router.post('/:id/replies', tweetController.postReply)
router.post('/:id/like', tweetController.likeTweet)
router.post('/:id/unlike', tweetController.unlikeTweet)
router.get('/:id', tweetController.getTweet)
router.post('/', tweetController.postTweet)
router.get('/', tweetController.getTweets)
router.use('/', apiErrorHandler)


module.exports = router
