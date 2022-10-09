const router = require('express').Router()
const tweetController = require('../../controllers/user/tweetController')

router.post('/:id/like', tweetController.addLike)
router.post('/:id/unlike', tweetController.removeLike)
router.get('/:tweet_id', tweetController.getTweet)
router.post('/', tweetController.addTweet)
router.get('/', tweetController.getAllTweets)

module.exports = router
