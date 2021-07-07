const express = require('express')
const router = express.Router()

const tweetController = require('../../controllers/tweetController')

router.post('/', tweetController.postTweet)

module.exports = router
