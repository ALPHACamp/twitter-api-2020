const express = require('express')
const router = express.Router()
const tweetController = require('../../../controllers/tweet-controller')

router.get('/:tweet_id/replies', tweetController.getReplies)
router.post('/:tweet_id/replies', tweetController.addReply,function(req,res){
  res.set('Access-Control-Allow-Origin', 'http://localhost:8080')
})
router.post('/:id/unlike', tweetController.unlikeTweet)
router.post('/:id/like', tweetController.likeTweet)
router.get('/:id', tweetController.getTweet)
router.post('/', tweetController.addTweet)
router.get('/', tweetController.getTweets)

module.exports = router
