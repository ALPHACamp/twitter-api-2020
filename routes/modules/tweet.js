const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweetController')

router.get('/', tweetController.getTweets)
module.exports = router
