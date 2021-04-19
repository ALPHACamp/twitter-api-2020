const express = require('express')
const router = express.Router()

const { authenticated } = require('../../middleware/auth')
const tweetController = require('../../controllers/tweetController')

router.get('/', authenticated, tweetController.getTweets)
router.post('/', authenticated, tweetController.postTweets)


module.exports = router
