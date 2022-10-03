const express = require('express')
const router = express.Router()

const tweetController = require('../../../controllers/tweet-controller.js')

router.get('/', tweetController.getTweets) // 瀏覽全部貼文
router.post('/', tweetController.postTweet) // 新增一筆貼文

module.exports = router
