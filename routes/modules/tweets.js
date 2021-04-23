const express = require('express')
const router = express.Router()
const { authenticated, authenticatedUser } = require('../../middleware/authenticate')
const tweetController = require('../../controllers/tweetController')

router.use(authenticated, authenticatedUser)
router.get('/', tweetController.getTweets)
router.post('/', tweetController.postTweet)

module.exports = router
