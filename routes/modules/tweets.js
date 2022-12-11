const express = require('express')
const router = express.Router()
const { authenticated, authenticatedUser } = require('../../middleware/auth')
const tweetController = require('../../controllers/tweet-controller')

// 使用者取得所有貼文
router.get('/', authenticated, authenticatedUser, tweetController.getTweets)

module.exports = router
