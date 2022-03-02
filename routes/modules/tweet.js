const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweet-controller')
const { paramsChecker } = require('../../middleware/check-params')

router.get('/', tweetController.getTweets)
router.post('/', tweetController.postTweets)
router.get('/:id/replies', paramsChecker, tweetController.getReplies)
router.post('/:id/replies', paramsChecker, tweetController.addReply)
router.post('/:id/like', paramsChecker, tweetController.likeTweet)
router.post('/:id/unlike', paramsChecker, tweetController.unlikeTweet)
router.get('/:id', paramsChecker, tweetController.getTweet)

module.exports = router
