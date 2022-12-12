const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweet-controller')
const { authenticated, authenticatedUser } = require('../../middleware/auth')

// 喜歡一則推文
router.post('/:id/like', authenticated, authenticatedUser, tweetController.addLike)
// 取消喜歡一則推文
router.post('/:id/unlike', authenticated, authenticatedUser, tweetController.unlikeTweet)
// 取得一則推文的所有回覆
router.get('/:tweet_id/replies', authenticated, authenticatedUser, tweetController.getTweetReplies)
// 使用者取得一則推文
router.get('/:tweet_id', authenticated, authenticatedUser, tweetController.getTweet)
// 新增一則推文
router.post('/', authenticated, authenticatedUser, tweetController.postTweet)
// 使用者取得所有推文
router.get('/', authenticated, authenticatedUser, tweetController.getTweets)

module.exports = router
