// 載入所需套件
const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweetController')
const { authenticated, checkNotAdmin } = require('../../middlewares/auth')

router.post('/', authenticated, checkNotAdmin, tweetController.postTweet)
router.get('/', authenticated, checkNotAdmin, tweetController.getTweets)
router.get('/:tweet_id', authenticated, checkNotAdmin, tweetController.getTweet)

// router exports
module.exports = router