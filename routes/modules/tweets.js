const router = require('express').Router()
const tweetController = require('../../controllers/tweet-controller.js')

router.get('/topUsers', tweetController.getTopUsers)
router.get('/:tweet_id/replies', tweetController.getReplies)
router.post('/:tweet_id/replies', tweetController.postReplies)
router.post('/:tweet_id/like', tweetController.postLikes)
router.post('/:tweet_id/unlike', tweetController.postUnLikes)
router.get('/:tweet_id', tweetController.getTweet)
// 查看所有貼文
router.get('/', tweetController.getTweets)
// 新增一筆推文
router.post('/', tweetController.postTweets)

module.exports = router
