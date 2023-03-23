const router = require('express').Router()
const tweetController = require('../../controllers/tweet-controller.js')
const upload = require('../../middleware/multer')

router.post('/:tweet_id/like', tweetController.like)
router.post('/:tweet_id/unlike', tweetController.unlike)
router.get('/:tweet_id/replies', tweetController.getReplies)
router.post('/:tweet_id/replies', upload.single('image'), tweetController.postReplies)
router.get('/', tweetController.getTweets)
router.post('/', upload.single('image'), tweetController.postTweet)
router.get('/:tweet_id', tweetController.getTweet)

module.exports = router
