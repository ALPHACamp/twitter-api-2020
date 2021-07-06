const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/api/tweetController')

router.get('/', tweetController.getTweets)

module.exports = router
