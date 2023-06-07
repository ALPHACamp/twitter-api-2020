const router = require('express').Router()
const tweetController = require('../../controllers/tweet-controller')

// test route (delete later)
router.post('/:tweetId/replies', tweetController.postReply) // 在推文中新增一條回覆
router.get('/:tweetId/replies', tweetController.getReplies) // 瀏覽推文下所有回覆

router.get('/:tweetId', tweetController.getTweet)
router.get('/', tweetController.getTweets)
router.post('/', tweetController.postTweet)

module.exports = router
