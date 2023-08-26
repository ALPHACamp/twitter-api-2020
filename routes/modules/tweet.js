const express = require('express')
const router = express.Router()

const tweetController = require('../../controllers/tweet-controller')
const upload = require('../../middleware/multer')

const { authenticated, authenticatedCurrentUser } = require('../../middleware/api-auth')

router.get('/:id', authenticated, tweetController.getTweet)
router.post('/', authenticated, tweetController.postTweet)
router.get('/', authenticated, tweetController.getTweets)

module.exports = router