const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweet-controller')
const { authenticated } = require('../../middleware/auth')

// 新增推文(tweet)
router.post('/', authenticated, tweetController.postTweet)
module.exports = router
