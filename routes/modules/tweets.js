const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweet-controller')
const { authenticated, authenticatedUser } = require('../../middleware/auth')

// 取得一則貼文的所有回覆
router.get('/:tweet_id/replies', authenticated, authenticatedUser, tweetController.getTweetReplies)
// 使用者取得一則貼文
router.get('/:tweet_id', authenticated, authenticatedUser, tweetController.getTweet)
// 使用者取得所有貼文
router.get('/', authenticated, authenticatedUser, tweetController.getTweets)

module.exports = router
