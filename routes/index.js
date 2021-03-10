const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const helpers = require('../_helpers')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

// 驗證使用者 middleware
const tweetController = require('../controllers/tweetController.js')
const userController = require('../controllers/userController.js')
const replyController = require('../controllers/replyController.js')
const followshipController = require('../controllers/followshipController.js')
const adminController = require('../controllers/adminController.js')
//身分認證
const authenticated = function (req, res, next) {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (!user) {
      return res
        .status(401)
        .json({ status: "error", message: "No auth token" })
    }
    req.user = user
    return next()
  })(req, res, next)
}
// 驗證管理員
function authenticatedAdmin(req, res, next) {
  if (helpers.getUser(req).role === 'admin' || helpers.getUser(req).isAdmin === true) {
    return next()
  } else {
    return res.status(401).json({ status: 'error', message: '權限驗證失敗' })
  }
}
// 驗證使用者
function authenticatedUser(req, res, next) {
  if (!helpers.getUser(req).isAdmin) {
    return next()
  } else {
    return res.status(401).json({ status: 'error', message: '權限驗證失敗' })
  }
}
// 測試區
router.get('/chat', authenticated, (req, res) => res.render('index'))
router.get('/login', (req, res) => res.render('login'))
router.post('/users/login', userController.signInTest)

// 登入
router.post('/api/users/signin', userController.signIn)
// 註冊
router.post('/api/users', userController.signUp)
// 當前用戶
router.get('/api/users/currentUser', authenticated, userController.getCurrentUser)
// 前十個追蹤推薦
router.get('/api/users/top', authenticated, authenticatedUser, userController.getTopUser)
// 個人資料
router.get('/api/users/:id', authenticated, authenticatedUser, userController.getUser)
// 修改個人資料
router.put('/api/users/:id', authenticated, authenticatedUser, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), userController.putUser)
// 使用者正在追蹤誰
router.get('/api/users/:id/followings', authenticated, authenticatedUser, userController.getFollowings)
// 誰在追蹤這個使用者
router.get('/api/users/:id/followers', authenticated, authenticatedUser, userController.getFollowers)
// 看見某使用者發過回覆的推文
router.get('/api/users/:id/replied_tweets', authenticated, authenticatedUser, userController.getRepliedTweets)
// 看見某使用者點過的 Like 
router.get('/api/users/:id/likes', authenticated, authenticatedUser, userController.getLikeTweets)
// 看見某使用者發過的推文
router.get('/api/users/:id/tweets', authenticated, authenticatedUser, userController.getUserTweets)



//admin
router.get('/api/admin/users', authenticated, authenticatedAdmin, adminController.getUsers)
router.get('/api/admin/tweets', authenticated, authenticatedAdmin, adminController.getTweets)
router.delete('/api/admin/tweets/:id', authenticated, authenticatedAdmin, adminController.deleteTweet)


// 瀏覽推文
router.get('/api/tweets', authenticated, authenticatedUser, tweetController.getTweets)
// 新增推文
router.post('/api/tweets', authenticated, authenticatedUser, tweetController.postTweet)
// 單一推文
router.get('/api/tweets/:id', authenticated, authenticatedUser, tweetController.getTweet)
// 編輯推文
router.put('/api/tweets/:id', authenticated, authenticatedUser, tweetController.putTweet)
// 刪除推文
router.delete('/api/tweets/:id', authenticated, authenticatedUser, tweetController.deleteTweet)
// 新增Like
router.post('/api/tweets/:id/like', authenticated, authenticatedUser, tweetController.postLike)
// 刪除 Like
router.post('/api/tweets/:id/unlike', authenticated, authenticatedUser, tweetController.deleteLike)
// 新增回覆
router.post('/api/tweets/:tweet_id/replies', authenticated, authenticatedUser, tweetController.postReply)
// 瀏覽回覆
router.get('/api/tweets/:tweet_id/replies', authenticated, authenticatedUser, tweetController.getReplies)
// 刪除回覆
router.delete('/api/replies/:id', authenticated, authenticatedUser, replyController.deleteReply)
// 
router.put('/api/replies/:id', authenticated, authenticatedUser, replyController.putReply)


router.post('/api/followships', authenticated, authenticatedUser, followshipController.postFollowship)
router.delete('/api/followships/:followingId', authenticated, authenticatedUser, followshipController.deleteFollowship)




module.exports = router
