const express = require('express')
const router = express.Router()
const tweetController = require('../controllers/tweetController')
const helpers = require('../_helpers')

router.post('/', helpers.authenticated, helpers.authenticatedUser, tweetController.postTweet)

router.post('/:TweetId/replies', helpers.authenticated, helpers.authenticatedUser, tweetController.postReply)

module.exports = router