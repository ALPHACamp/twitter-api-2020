const express = require('express')
const router = express.Router()

const tweetController = require('../../controllers/tweet-controller')
const { authUser } = require('../../middleware/auth')

router.post('/:id/like', authUser, tweetController.likeTweet)
router.post('/:id/unlike', authUser, tweetController.unlikeTweet)
router.get('/:tweet_id/replies', tweetController.getTweetReplies)
router.get('/:id', tweetController.getTweet)
router.get('/', tweetController.getTweets)
router.post('/', authUser, tweetController.addTweet)

module.exports = router
