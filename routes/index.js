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

// 單一 user 的所有推文
router.get('/api/users/:id/tweets', auth, isUser, userController.getTweets)
// 單一 user 的所有回覆
router.get('/api/users/:id/replied_tweets', auth, isUser, userController.getReplies)
// 取得某 user 的跟隨者資料
router.get('/api/users/:id/followers', auth, isUser, userController.getFollowers)
// 取得某 user 所有 follow 的人
router.get('/api/users/:id/followings', auth, isUser, userController.getFollowings)
// 取得 like 資料
router.get('/api/users/:id/likes', auth, isUser, userController.getLikes)
// 更新 notify 狀態
router.patch('/api/users/:id/notification', auth, isUser, userController.patchNotification)
// 取得某 user 的資料
router.get('/api/users/:id', auth, isUser, userController.getUserInfo)
// 更新使用者資料
router.put('/api/users/:id', auth, isUser, upload.fields([{ name: 'image' }, { name: 'avatar' }]), userController.putUser)
// 註冊帳號
router.post('/api/users', userController.signUp)
// 登入帳號
router.post('/api/login', passport.authenticate('local', { session: false }), userController.signIn)

// 新增回覆
router.post('/api/tweets/:tweet_id/replies', auth, isUser, tweetController.postReply)
// 取得某推文的回覆
router.get('/api/tweets/:tweet_id/replies', auth, isUser, tweetController.getReply)
// 取得單一推文
router.get('/api/tweets/:id', auth, isUser, tweetController.getTweet)
// 取得所有推文
router.get('/api/tweets', auth, isUser, tweetController.getTweets)
// 新增推文
router.post('/api/tweets', auth, isUser, tweetController.postTweet)

// 增加 like 記錄
router.post('/api/tweets/:id/like', auth, isUser, userController.addLike)
// 刪除 like 記錄
router.post('/api/tweets/:id/unlike', auth, isUser, userController.removeLike)

// 取得 follower 前十多的 user
router.get('/api/followships10', auth, isUser, userController.getTopFollowing)
// follow 某 user
router.post('/api/followships', auth, isUser, userController.addFollowing)
// 取消 follow 某 user
router.delete('/api/followships/:followingId', auth, isUser, userController.removeFollowing)

// 有錯就到這
router.use('/', apiErrorHandler)

module.exports = router
