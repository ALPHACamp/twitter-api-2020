const express = require('express')
const router = express.Router()


// 尚未加入 authenticatedAdmin
const { authenticated, authenticatedUser } = require('../middleware/auth')

const tweetController = require('../controllers/tweet-controller')

const { apiErrorHandler } = require('../middleware/error-handler')



// Tweet APIs
router.get('/tweets/:tweet_id', tweetController.getTweet)
router.get('/tweets', tweetController.getTweets)
router.post('/tweets', tweetController.postTweet)


router.use('/', apiErrorHandler)

module.exports = router
