const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const passport = require('../config/passport')
const helpers = require('../_helpers')

const adminController = require('../controllers/api/adminControllers')
const userController = require('../controllers/api/userControllers')
const tweetController = require('../controllers/api/tweetControllers')
const replyController = require('../controllers/api/replyController')
const messageController = require('../controllers/api/messageControllers')

// 驗證user
function authenticated (req, res, next) {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) next(err)
    if (!user) {
      return res.json({
        status: 'error',
        message: '帳號不存在！'
      })
    }
    req.user = user
    return next()
  })(req, res, next)
}

// 驗證admin
function authenticatedAdmin (req, res, next) {
  if (helpers.getUser(req)) {
    if ((helpers.getUser(req).role = 'admin')) {
      return next()
    }
    return res.json({ status: 'error', message: '帳號不存在！' })
  } else {
    return res.json({ status: 'error', message: '帳號不存在！' })
  }
}

const uploadImage = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }])

// admin相關路由
// 站內使用者
router.get('/admin/users', authenticated, authenticatedAdmin, adminController.getUsers)
// 推文
router.get('/admin/tweets', authenticated, authenticatedAdmin, adminController.getTweets)
router.delete('/admin/tweets/:id', authenticated, authenticatedAdmin, adminController.deleteTweet)
// 登入
router.post('/admin/signin', adminController.signIn)

// 跟user相關路由
// 登入與註冊
router.post('/signin', userController.signIn)
router.post('/users', userController.signUp)
// TOP10 followers
router.get('/users/top', authenticated, userController.getTopUser)

// 查看某user的資訊
// reply
router.get('/users/:id/replied_tweets', authenticated, userController.getUserReplies)
// tweet
router.get('/users/:id/tweets', authenticated, userController.getUserTweets)
// like
router.get('/users/:id/likes', authenticated, userController.getUserLikes)
// followship
router.get('/users/:id/followings', authenticated, userController.getUserFollowings)
router.get('/users/:id/followers', authenticated, userController.getUserFollowers)
// 取得與編輯user資訊
router.put('/users/:id/setting', authenticated, userController.putUserSetting)
router.get('/users/:id', authenticated, userController.getUser)
router.put('/users/:id', authenticated, uploadImage, userController.putUser)
// 當前登入user
router.get('/get_current_user', authenticated, userController.getCurrentUser)

// 跟followship相關路由
router.post('/followships', authenticated, userController.addFollowing)
router.delete('/followships/:followingId', authenticated, userController.removeFollowing)

// 跟notice相關路由
router.post('/notice', authenticated, userController.addNoticing)
router.delete('/notice/:noticeId', authenticated, userController.removeNoticing)

// 跟tweets相關路由
router.post('/tweets', authenticated, tweetController.postTweet)
router.get('/tweets/:tweet_id', authenticated, tweetController.getTweet)
router.get('/tweets', authenticated, tweetController.getTweets)

// 跟like相關路由
router.post('/tweets/:tweet_id/like', authenticated, tweetController.likeTweet)
router.post('/tweets/:tweet_id/unlike', authenticated, tweetController.unlikeTweet)

// 跟reply相關路由
router.post('/tweets/:tweet_id/replies', authenticated, replyController.postReply)
router.get('/tweets/:tweet_id/replies', authenticated, replyController.getReply)

// 用來產生模擬users
router.get('/users', authenticated, userController.getUsers)

// getMessages
router.get(`/messages`, authenticated, messageController.getMessages)

module.exports = router
