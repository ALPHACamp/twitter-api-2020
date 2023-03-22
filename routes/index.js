const express = require('express')
const router = express.Router()
const { errorHandler } = require('../middleware/error-handler')
const { authenticated } = require('../middleware/auth')
const userController = require('../controllers/user-controller')
const tweetController = require('../controllers/tweet-controller')

router.post('/:role/signin', userController.signin)

router.get('/tweets', authenticated, tweetController.getTweets)
router.post('/tweets', authenticated, tweetController.postTweet)

router.use('/', errorHandler) // 錯誤處理
module.exports = router
