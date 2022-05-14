const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

const userController = require('../controllers/user-controller')
const tweetController = require('../controllers/tweet-controller')
const { apiErrorHandler } = require('../middleware/error-handler')

// 尚未加入 authenticatedAdmin
const { authenticated, authenticatedUser } = require('../middleware/auth')
const { getCurrentUser } = require('../controllers/user-controller')

// 註冊/登入
router.post('/users', userController.signUp)
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)

// 取得目前登入的使用者資料
router.get('/users/current_user', authenticated, authenticatedUser, getCurrentUser)

// 取得指定使用者資料
router.get('/users/:id', authenticated, userController.getUser)

// Tweet APIs
router.get('/tweets/:tweet_id/replies', authenticated, authenticatedUser, tweetController.getTweetReplies)
router.post('/tweets/:tweet_id/replies', authenticated, authenticatedUser, tweetController.postTweetReply)
router.get('/tweets/:tweet_id', authenticated, authenticatedUser, tweetController.getTweet)
router.get('/tweets', authenticated, authenticatedUser, tweetController.getTweets)
router.post('/tweets', authenticated, authenticatedUser, tweetController.postTweet)

router.use('/', apiErrorHandler)

module.exports = router
