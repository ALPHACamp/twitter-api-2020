const express = require('express')
const router = express.Router()

const tweetController = require('../../controllers/tweet-controller')

router.get('/:id/replies', tweetController.getReplies) // User查看單筆Tweet的回覆
router.post('/:id/replies', tweetController.postReply) // User對單筆推文回覆
router.post('/:id/like', tweetController.addLike) // User對單筆Tweet按Like
router.post('/:id/unlike', tweetController.removeLike) // User對單筆Tweet取消Like
router.get('/:id', tweetController.getTweet) // User查看單筆Tweet
router.get('/', tweetController.getTweets) // User查看所有Tweets
router.post('/', tweetController.postTweet) // User 新增一則Tweet
module.exports = router
