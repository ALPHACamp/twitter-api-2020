const express = require('express')
const router = express.Router()

const userController = require('../controllers/user-controller')
const tweetController = require('../controllers/tweet-controller')
const passport = require('../config/passport')
const admin = require('./modules/admin')
const { auth, isAdmin, isUser } = require('../middleware/api-auth')
const { apiErrorHandler } = require('../middleware/error-handler')

router.use('/api/admin', auth, isAdmin, admin)
// router.get('/api/admin/restaurants', auth, apiErrorHandler)

router.get('/api/users/:id/tweets', auth, isUser, userController.getTweets)
router.get('/api/users/:id', auth, isUser, userController.getUser)

router.post('/api/users', userController.signUp) // 註冊帳號路由
// (下1) session: false 的功能，把 cookie/session 功能關掉，不管理它
router.post('/api/signin', passport.authenticate('local', { session: false }), userController.signIn) // 注意是 post

router.post('/api/tweets/:tweet_id/replies', auth, isUser, tweetController.postReply)
router.get('/api/tweets/:tweet_id/replies', auth, isUser, tweetController.getReply)

router.get('/api/tweets/:id', auth, isUser, tweetController.getTweet)
router.get('/api/tweets', auth, isUser, tweetController.getTweets)
router.post('/api/tweets', auth, isUser, tweetController.postTweet)

router.use('/', apiErrorHandler)

module.exports = router
