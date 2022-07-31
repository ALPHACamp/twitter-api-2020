const express = require('express')
const router = express.Router()

const tweetController = require('../../controllers/tweet-controller')
const likeController = require('../../controllers/like-controller')
const replyController = require('../../controllers/reply-controller')

router.get('/:id', tweetController.getTweet)
router.get('/', tweetController.getTweets)
router.post('/', tweetController.postTweet)

router.post('/:id/like', likeController.addLike)
router.post('/:id/unlike', likeController.removeLike)

router.post('/:tweet_id/replies', replyController.postReply)
router.get('/:tweet_id/replies', replyController.getReplies)

module.exports = router
