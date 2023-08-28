const express = require('express')
const router = express.Router()

const tweetController = require('../../controllers/tweet-controller')
const replyController = require('../../controllers/reply-controller')

// 查看回覆
router.get('/:tweetId/replies', replyController.getTweetReplies)
// 發佈回覆
router.post('/:tweetId/replies', replyController.postReply)
// 喜歡特定推文
router.post('/:tweetId/like', tweetController.addLike)
// 取消喜歡特定推文
router.post('/:tweetId/unlike', tweetController.removeLike)
// 取得特定推文
router.get('/:tweetId', tweetController.getTweet)
// 取得全部推文
router.get('/', tweetController.getTweets)
// 發佈推文
router.post('/', tweetController.postTweet)

module.exports = router
