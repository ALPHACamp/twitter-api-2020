const express = require('express')
const router = express.Router()
const tweetController = require('../controllers/tweetController')
const helpers = require('../_helpers')

router.post('/', helpers.authenticated, helpers.authenticatedUser, tweetController.postTweet)

module.exports = router