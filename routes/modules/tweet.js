const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweet-controller')

// 新增推文(tweet)
router.post('/', tweetController.postTweet)
module.exports = router
