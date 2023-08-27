const express = require('express')
const router = express.Router()

const tweetController = require('../../controllers/tweet-controller')
const upload = require('../../middleware/multer')

// like or unlike function 
// router.delete('/:id/like', tweetController.unlikeTweet)
router.post('/:id/unlike', tweetController.unlikeTweet)
router.post('/:id/like', tweetController.likeTweet)

// reply tweet function
router.get('/:id/replies', tweetController.getReplies)
router.post('/:id/replies', tweetController.postReply)

// tweets function 
router.get('/:id', tweetController.getTweet)
router.post('/', tweetController.postTweet)
router.get('/', tweetController.getTweets)


module.exports = router