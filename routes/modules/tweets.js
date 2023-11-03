const express = require('express')
const router = express.Router()

const tweetController = require('../../controllers/tweet-controller')

router.get('/', tweetController.getTweets) // User查看所有Tweets
router.post('/', tweetController.postTweet) // User 新增一則Tweet
module.exports = router
