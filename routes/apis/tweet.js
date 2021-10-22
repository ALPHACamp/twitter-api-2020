const express = require('express')
const router = express.Router()
const { authenticated, authenticatedNotAdmin } = require('../../middleware/auth.js')

const likeController = require('../../controllers/likeController.js')
const tweetController = require('../../controllers/tweetController.js')
const replyController = require('../../controllers/replyController.js')

router.use(authenticated, authenticatedNotAdmin) // 下方路由皆須身份驗證

// tweet routes
router.get('/', tweetController.getTweets)
router.post('/', tweetController.postTweet)
router.get('/:id', tweetController.getTweet)

// like route
router.post('/:id/like', likeController.addLike)
router.post('/:id/unlike', likeController.removeLike)

// reply routes
router.post('/:tweet_id/replies', replyController.postReply)
router.get('/:tweet_id/replies', replyController.getReplies)

module.exports = router
