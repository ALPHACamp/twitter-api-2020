const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const userController = require('../controller/user-controller')
const tweetController = require('../controller/tweet-controller')
const { authenticated, authenticatedAdmin, authenticatedUser } = require('../middleware/api-auth')
const { apiErrorHandler } = require('../middleware/error-handler')

// Tweets
router.post('/api/tweets', authenticatedUser, tweetController.createTweet)
router.get('/api/tweets', tweetController.getTweets)
// router.get('/api/tweets/:tweet_id', tweetController.getTweetById)

// Users
router.get('/api/users/:id/tweets', authenticated, authenticatedUser, userController.getUserTweets)
router.get('/api/users/:id', authenticated, authenticatedUser, userController.getUser)
// 登入& 註冊
router.post('/api/users/login', userController.signIn)
router.post('/api/users', userController.signUp)
// 錯誤訊息處理
router.use('/', apiErrorHandler)

module.exports = router
