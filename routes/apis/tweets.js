// 載入所需套件
const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweetController')
const replyController = require('../../controllers/replyController')
const likeController = require('../../controllers/likeController')
const { authenticated, checkNotAdmin } = require('../../middlewares/auth')

router.post('/', authenticated, checkNotAdmin, tweetController.postTweet)
router.get('/', authenticated, checkNotAdmin, tweetController.getTweets)
router.get('/:tweet_id', authenticated, checkNotAdmin, tweetController.getTweet)

router.post('/:tweet_id/replies', authenticated, checkNotAdmin, replyController.postReply)
router.get('/:tweet_id/replies', authenticated, checkNotAdmin, replyController.getReplies)

router.post('/:tweet_id/like', authenticated, checkNotAdmin, likeController.postLike)


// router exports
module.exports = router