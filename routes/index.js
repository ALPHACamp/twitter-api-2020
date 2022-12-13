const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const admin = require('./modules/admin')
const userController = require('../controllers/user-controller')
const tweetController = require('../controllers/tweet-controller')
const replyController = require('../controllers/reply-controller')
const { authenticated, authenticatedAdmin, authenticatedUser } = require('../middleware/auth')

// 後台登入
router.post('/admin/signin', passport.authenticate('local', { session: false }), authenticatedAdmin, userController.signIn)
// 後台功能路由
router.use('/admin', authenticated, authenticatedAdmin, admin)
// 前台註冊
router.post('/users', userController.signUp)
// 前台登入
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)

// Reply CRUD
router.get('/tweets/:id/replies', authenticated, authenticatedUser, replyController.getReplies)
router.post('/tweets/:id/replies', authenticated, authenticatedUser, replyController.postReply)

// Tweet CRUD：
router.get('/tweets/:tweet_id', authenticated, authenticatedUser, tweetController.getTweet)
router.get('/tweets', authenticated, authenticatedUser, tweetController.getTweets)
router.post('/tweets', authenticated, authenticatedUser, tweetController.postTweet)

router.use('/', (req, res) => {
  res.json('api test main')
})

module.exports = router
