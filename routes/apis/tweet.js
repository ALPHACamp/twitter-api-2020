const router = require('express').Router()
const tweetController = require('../../controllers/tweet-controller.js')
const upload = require('../../middleware/multer')

router.get('/', tweetController.getTweets)
router.post('/', upload.single('image'), tweetController.postTweet)
router.get('/:tweet_id', tweetController.getTweet)
router.post('/:id/like', tweetController.like)
router.post('/:id/unlike', tweetController.unlike)

module.exports = router
