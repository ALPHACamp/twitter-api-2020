const router = require('express').Router()
const tweetController = require('../../controllers/tweet-controller.js')

router.get('/:tweet_id/replies', tweetController.getReplies)
router.get('/:tweet_id', tweetController.getTweet)
// 查看所有貼文
router.get('/', tweetController.getTweets)
// 新增一筆推文
router.post('/', tweetController.postTweets)

module.exports = router
