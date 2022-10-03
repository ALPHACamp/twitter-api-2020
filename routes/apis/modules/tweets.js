const express = require('express')
const router = express.Router()

const tweetController = require('../../../controllers/tweet-controller.js')

router.post('/', tweetController.postTweet)

module.exports = router
