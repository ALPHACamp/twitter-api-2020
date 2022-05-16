const express = require('express')
const passport = require('../config/passport')
const userController = require('../controllers/user-controller')
const adminController = require('../controllers/admin-controller')
const tweetController = require('../controllers/tweet-controller')
const replyController = require('../controllers/reply-controller')
const likeControler = require('../controllers/like-controller')
const followshipController = require('../controllers/followship-controller')
const router = express.Router()
const upload = require('../middleware/multer')

// 中間件
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { errorHandler } = require('../middleware/error-handler')

// 後台路由模組載入
const admin = require('./models/admin')

// 登入相關路由
router.post('/api/login', passport.authenticate('local', { session: false }), userController.login)
router.post('/api/admin/login', passport.authenticate('local', { session: false }), adminController.login)

// 喜歡相關路由
router.post('/api/tweets/:id/like', authenticated, likeControler.add)
router.post('/api/tweets/:id/unlike', authenticated, likeControler.remove)

// 推文相關路由
router.get('/api/tweets/:id', authenticated, tweetController.getOne)
router.get('/api/tweets', authenticated, tweetController.getAll)
router.post('/api/tweets', authenticated, tweetController.create)

// 回覆相關路由
router.get('/api/tweets/:tweet_id/replies', authenticated, replyController.getAll)
router.post('/api/tweets/:tweet_id/replies', authenticated, replyController.create)
router.post('/api/replies/:id/like', authenticated, replyController.add)
router.post('/api/replies/:id/unlike', authenticated, replyController.remove)

// 追蹤相關路由
router.delete('/api/followships/:followingId', followshipController.deleteFollowship)
router.post('/api/followships', authenticated, followshipController.postFollowship)

// 使用者相關路由
router.get('/api/users/:id/tweets', authenticated, userController.getUserTweet)
router.get('/api/users/:id/replied_tweets', authenticated, userController.userRepliedTweets)
router.get('/api/users/:id/likes', authenticated, userController.userLikes)
router.get('/api/users/:id/followings', authenticated, userController.userFollowings)
router.get('/api/users/:id/followers', authenticated, userController.userFollowers)
router.get('/api/users/topFollowedUser', authenticated, userController.getTopUsers)
router.get('/api/users/:id', authenticated, userController.getUser)
router.put('/api/users/:id', upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'avatar', maxCount: 1 }]), userController.putUser)
router.post('/api/users', userController.signUp)

// 導入後台
router.use('/api/admin', authenticated, authenticatedAdmin, admin)

// 錯誤處理
router.use('/', errorHandler)

module.exports = router
