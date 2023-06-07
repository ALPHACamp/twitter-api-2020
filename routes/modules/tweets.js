const router = require('express').Router()
const tweetController = require('../../controllers/tweet-controller')

// test route (delete later)
router.get('/:tweetId', tweetController.getTweet)
router.get('/', tweetController.getTweets)
router.post('/', tweetController.postTweet)

module.exports = router
