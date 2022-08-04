const express = require('express')
const router = express.Router()

const tweetController = require('../../controllers/tweet-controller')
const { authUser } = require('../../middleware/auth')

router.post('/:id/like', authUser, tweetController.likeTweet)
router.post('/:id/unlike', authUser, tweetController.unlikeTweet)
router.get('/:tweet_id/replies', authUser, tweetController.getTweetReplies)
router.post('/:tweet_id/replies', authUser, tweetController.replyTweet)
router.get('/:id', authUser, tweetController.getTweet)
router.post('/', authUser, tweetController.addTweet)
router.get('/', tweetController.getTweets)

module.exports = router
