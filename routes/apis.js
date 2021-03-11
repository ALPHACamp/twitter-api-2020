const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

// import controller
const userController = require('../controllers/api/userController')
const adminController = require('../controllers/api/adminController')
const tweetController = require('../controllers/api/tweetController')
const replyController = require('../controllers/api/replyController')
const likeController = require('../controllers/api/likeController')

const helpers = require('../_helpers')

// 上傳檔案
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }])

// 使用者JWT認證
const authenticated = function (req, res, next) {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'No auth token' })
    }
    req.user = user
    return next()
  })(req, res, next)
}


// admin權限認證
const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req)) {
    if (helpers.getUser(req).role === 'admin') {
      return next()
    }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

// user
router.post('/users', userController.signUp)
router.post('/signin', userController.signIn)
router.put('/users/:id', authenticated, cpUpload, userController.editUser)
router.get('/users/:id', authenticated, userController.getUser)
router.get('/users/:id/tweets', authenticated, userController.getUserTweets)
router.get('/users/:id/replied_tweets', authenticated, userController.getUserReplies)
router.get('/users/:id/followings', authenticated, userController.getUserFollowings)
router.get('/users/:id/followers', authenticated, userController.getUserFollowers)
router.get('/users/:id/likes', authenticated, userController.getUserLikes)
router.get('/topusers', authenticated, userController.getTopUsers)
router.get('/get_current_user', authenticated, userController.getCurrentUser)


//follow
router.post('/followships', authenticated, userController.addFollowing)
router.delete('/followships/:followingId', authenticated, userController.removeFollowing)


// tweet
// 取得所有推文資料
router.get('/tweets', authenticated, tweetController.getTweets)
// 取得一筆推文相關資料
router.get('/tweets/:tweet_id', authenticated, tweetController.getTweet)
// 新增推文
router.post('/tweets', authenticated, tweetController.postTweet)
// 修改推文
router.put('/tweets/:tweet_id', authenticated, tweetController.putTweet)


// reply
// 查詢推文的相關回覆資料
router.get('/tweets/:tweet_id/replies', authenticated, replyController.getReplies)
// 查詢推文的相關回覆量
router.get('/tweets/:tweet_id/replies/count', authenticated, replyController.getRepliesCount)
// 新增回覆
router.post('/tweets/:tweet_id/replies', authenticated, replyController.postReply)
// 修改回覆
router.put('/replies/:reply_id', authenticated, replyController.putReply)
// 刪除回覆
router.delete('/replies/:reply_id', authenticated, replyController.deleteReply)


// Like
// 取得推文按讚數、相關資訊
router.get('/tweets/:tweet_id/likes', authenticated, likeController.getLikes)
// 標記喜歡
router.post('/tweets/:tweet_id/like', authenticated, likeController.addLike)
// 取消標記
router.post('/tweets/:tweet_id/unlike', authenticated, likeController.removeLike)


// admin
// JWT signin
router.post('/admin/signin', adminController.signIn)
// 搜尋使用者
router.get('/admin/users', authenticated, authenticatedAdmin, adminController.getUsers)
// 輕量資料
router.get('/admin/users/light', authenticated, authenticatedAdmin, adminController.getUsersLight)
// 全部推文資料
router.get('/admin/tweets', authenticated, authenticatedAdmin, adminController.getTweets)
// 刪除一筆推文
router.delete('/admin/tweets/:tweet_id', authenticated, authenticatedAdmin, adminController.deleteTweet)

module.exports = router