const express = require('express')
const router = express.Router()

const tweetController = require('../../controllers/tweet-controller')
const { authUser } = require('../../middleware/auth')

router.get('/', tweetController.getTweets)
router.post('/', authUser, tweetController.addTweet)

module.exports = router
