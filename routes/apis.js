const express = require('express')
const router = express.Router()
const tweetController = require('../controllers/api/tweetController.js')

// admin
router.get('/tweets', tweetController.getTweets)

module.exports = router
