const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const admin = require('./modules/admin')
const userController = require('../controllers/user-controller')
const tweetController = require('../controllers/tweet-controller')
const replyController = require('../controllers/reply-controller')
const { authenticated, authenticatedAdmin, authenticatedUser } = require('../middleware/auth')

router.get('/users/:id/tweets', authenticated, authenticatedUser, userController.getTweets)
router.get('/users/:id/replied_tweets', authenticated, authenticatedUser, userController.getRepliedTweets)
// 取得使用者喜歡的內容
// router.get('/users/:id/likes', authenticated, authenticatedUser, userController.)
// // 取得使用者正在關注的名單
// router.get('/users/:id/followings', authenticated, authenticatedUser, userController.)
// // 取得使用者正在跟隨的名單
// router.get('/users/:id/followers', authenticated, authenticatedUser, userController.)
// // 修改個人資料
// router.put('/users/:id', authenticated, authenticatedUser, userController.)
// // 修改個人帳號設定
// router.put('/users/:id/setting', authenticated, authenticatedUser, userController.)
// // 更新個人封面照片
// router.patch('/users/:id/cover', authenticated, authenticatedUser, userController.)
router.get('/users/:id', authenticated, authenticatedUser, userController.getUser)
router.get('/users', authenticated, authenticatedUser, userController.getCurrentUser)

// 後台登入
router.post('/admin/signin', passport.authenticate('local', { session: false }), authenticatedAdmin, userController.signIn)
// 後台功能路由
router.use('/admin', authenticated, authenticatedAdmin, admin)
// 前台註冊
router.post('/users', userController.signUp)
// 前台登入
router.post('/signin', passport.authenticate('local', { session: false }), authenticatedUser, userController.signIn)

// Followship
router.post('/followships', authenticated, authenticatedUser, userController.addFollowing)
router.delete('/followships/:followingId', authenticated, authenticatedUser, userController.removeFollowing)
// Like
router.post('/tweets/:id/like', authenticated, authenticatedUser, tweetController.addLike)
router.post('/tweets/:id/unlike', authenticated, authenticatedUser, tweetController.removeLike)

// Reply
router.get('/tweets/:tweet_id/replies', authenticated, authenticatedUser, replyController.getReplies)
router.post('/tweets/:tweet_id/replies', authenticated, authenticatedUser, replyController.postReply)

// Tweet
router.get('/tweets/:tweet_id', authenticated, authenticatedUser, tweetController.getTweet)
router.get('/tweets', authenticated, authenticatedUser, tweetController.getTweets)
router.post('/tweets', authenticated, authenticatedUser, tweetController.postTweet)

router.use('/', (req, res) => {
  res.json('api test main')
})

module.exports = router
