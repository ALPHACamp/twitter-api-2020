const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweet-controller')

router.post('/:tweet_id/replies', tweetController.addReply)
router.get('/:tweet_id/replies', tweetController.viewReplies)
router.post('/:id/like', tweetController.addLike)
router.post('/:id/unlike', tweetController.removeLike)
router.get('/:tweet_id', tweetController.getTweet)
router.post('/', tweetController.postTweet)

module.exports = router