const router = require('express').Router()
const tweetController = require('../../controllers/tweet-controller.js')

router.get('/:tweet_id/replies', tweetController.getReplies)
router.get('/:tweet_id', tweetController.getTweet)

module.exports = router
