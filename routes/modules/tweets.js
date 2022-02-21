const express = require('express')
const router = express.Router()

const tweetController = require('../../controllers/tweet-controllers')

router.post('/', tweetController.postTweet)

module.exports = router
