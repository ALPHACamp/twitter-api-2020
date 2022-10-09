const router = require('express').Router()
const tweetController = require('../../controllers/user/tweetController')

router.post('/:id/like', tweetController.addLike)
router.post('/:id/unlike', tweetController.removeLike)
router.post('/:tweet_id/replies', tweetController.addReply)
router.get('/:tweet_id/replies', tweetController.getReplies)
router.get('/:tweet_id', tweetController.getTweet)
router.post('/', tweetController.addTweet)
router.get('/', tweetController.getAllTweets)

module.exports = router
