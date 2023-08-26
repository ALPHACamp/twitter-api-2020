const express = require('express')
const router = express.Router()

const tweetController = require('../../controllers/tweet-controller')

// 取得全部貼文
router.get('/', tweetController.getTweets)

module.exports = router
