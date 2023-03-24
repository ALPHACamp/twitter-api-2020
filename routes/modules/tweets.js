const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweet-controller')
const { tweetValidation, replyValidation, validateForm } = require('../../middleware/validator')

// 在特定推文下留言
router.post('/:tweet_id/replies', replyValidation, validateForm, tweetController.postReply)

// 瀏覽特定推文下留言
router.get('/:tweet_id/replies', tweetController.getReplies)

// 對特定推文表達喜歡
router.post('/:id/like', tweetController.addLike)

// 取消對特定推文的喜歡
router.post('/:id/unlike', tweetController.removeLike)

// 瀏覽特定推文
router.get('/:tweet_id', tweetController.getTweet)

// 刪除特定推文
router.delete('/:tweet_id', tweetController.deleteTweet)

// 發送推文
router.post('/', tweetValidation, validateForm, tweetController.postTweet)

// 瀏覽所有推文
router.get('/', tweetController.getTweets)

module.exports = router
