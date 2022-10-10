const express = require('express')
const router = express.Router()
const tweetController = require('../../../controllers/tweet-controller')
const { authenticateUser } = require('../../../middleware/auth')

router.get('/:tweet_id/replies', authenticateUser, tweetController.getReplies)
router.post('/:tweet_id/replies', authenticateUser, tweetController.addReply)
router.get('/:id', authenticateUser, tweetController.getTweet)
router.post('/', authenticateUser,tweetController.addTweet)
router.get('/', tweetController.getTweets)
module.exports = router
