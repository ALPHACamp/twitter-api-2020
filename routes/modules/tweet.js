const express = require('express')
const router = express.Router()

const tweetController = require('../../controllers/tweet-controller')
const upload = require('../../middleware/multer')

router.post('/', tweetController.postTweet)
router.get('/', tweetController.getTweets)

module.exports = router