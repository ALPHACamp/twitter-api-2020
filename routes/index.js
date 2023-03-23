const express = require('express')
const router = express.Router()

const userController = require('../controllers/user-controller')
const tweetController = require('../controllers/tweet-controller')
const passport = require('../config/passport')
const admin = require('./modules/admin')
const upload = require('../middleware/multer')
const { auth, isAdmin, isUser } = require('../middleware/api-auth')
const { apiErrorHandler } = require('../middleware/error-handler')

router.use('/api/admin', auth, isAdmin, admin)
// router.get('/api/admin/restaurants', auth, apiErrorHandler)

// (下1) 單一 user 的所有推文
router.get('/api/users/:id/tweets', auth, isUser, userController.getTweets)
// (下1) 單一 user 的所有回覆
router.get('/api/users/:id/replied_tweets', auth, isUser, userController.getReplies)
router.get('/api/users/:id', auth, isUser, userController.getUserInfo)

router.post('/api/users', userController.signUp) // 註冊帳號路由
router.put('/api/users/:id', auth, isUser, upload.single('image'), userController.putUser)
// (下1) session: false 的功能，把 cookie/session 功能關掉，不管理它
router.post('/api/signin', passport.authenticate('local', { session: false }), userController.signIn) // 注意是 post

router.post('/api/tweets/:tweet_id/replies', auth, isUser, tweetController.postReply)
router.get('/api/tweets/:tweet_id/replies', auth, isUser, tweetController.getReply)

router.get('/api/tweets/:id', auth, isUser, tweetController.getTweet)
router.get('/api/tweets', auth, isUser, tweetController.getTweets)
router.post('/api/tweets', auth, isUser, tweetController.postTweet)

router.use('/', apiErrorHandler)

module.exports = router
