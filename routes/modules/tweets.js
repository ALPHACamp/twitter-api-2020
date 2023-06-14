const express = require('express')
const router = express.Router()
const userController = require('../../controllers/apis/user-controller')
const { authenticated } = require('../../middleware/api-auth')
const tweetController = require('../../controllers/apis/tweet-controller')

router.get('/postTweet', authenticated, tweetController.getPostTweet)
router.post('/:tweet_id/replies', authenticated, tweetController.postReply)
router.get('/:tweet_id/replies', authenticated, tweetController.getReplies)
router.get('/:tweet_id', authenticated, tweetController.getTweet)
router.post('/:id/unlike', authenticated, userController.removeLike)
router.post('/:id/like', authenticated, userController.addLike)
router.get('/', authenticated, tweetController.getTweets)
router.post('/', authenticated, tweetController.postTweet)

module.exports = router