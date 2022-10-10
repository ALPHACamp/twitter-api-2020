const express = require('express')
const router = express.Router()
const tweetController = require('../../../controllers/tweet-controller')
const { authenticateUser } = require('../../../middleware/auth')

router.get('/:id', tweetController.getTweet)
router.get('/', tweetController.getTweets)
router.post('/', tweetController.addTweet)

module.exports = router
