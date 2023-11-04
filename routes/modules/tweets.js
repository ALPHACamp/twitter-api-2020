const express = require('express')
const router = express.Router()

const tweetController = require('../../controllers/tweet-controller')

router.get('/:id', tweetController.getTweet) // User查看單筆Tweet
router.get('/', tweetController.getTweets) // User查看所有Tweets
router.post('/', tweetController.postTweet) // User 新增一則Tweet
module.exports = router
