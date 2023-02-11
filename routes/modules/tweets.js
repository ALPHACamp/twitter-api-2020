const express = require('express')
const router = express.Router()

const tweetController = require('../../controllers/tweetController')
const replyController = require('../../controllers/replyController')
const likeController = require('../../controllers/likeController')

router.post('/:tweet_id/like', likeController.addLike)
router.post('/:tweet_id/unlike', likeController.unLike)
router.post('/:tweet_id/replies', replyController.postReply)
router.get('/:tweet_id/replies', replyController.getReplies)
router.get('/:tweet_id', tweetController.getTweet)
router.get('/', tweetController.getTweets)
router.post('/', tweetController.postTweet)

module.exports = router
