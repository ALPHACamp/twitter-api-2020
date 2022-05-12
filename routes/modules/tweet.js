const express = require('express')
const router = express.Router()

const tweetController = require('../../controllers/tweet-controller')

router.get('/', tweetController.getAllTweet)
router.get('/:id', tweetController.getTweet)

router.post('/', tweetController.postTweet)

module.exports = router
