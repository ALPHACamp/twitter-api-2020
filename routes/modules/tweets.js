const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweet-controller')

// setting routes
router.get('/', tweetController.getTweets)

module.exports = router
