const express = require('express')
const router = express.Router()

const tweetController = require('../controllers/api/tweet-controller')

router.get('/tweets', tweetController.getTweets)

module.exports = router
