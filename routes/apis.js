const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

// import controller
const userController = require('../controllers/api/userController')
const adminController = require('../controllers/api/adminController')
const tweetController = require('../controllers/api/tweetController')

const helpers = require('../_helpers')

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
router.post('/signin', authenticated, userController.getUser)


// tweet
// 取得所有推文資料
router.get('/tweets', authenticated, tweetController.getTweets)
// 取得一筆推文相關資料
router.get('/tweets/:tweet_id', authenticated, tweetController.getTweet)
// 查詢推文的相關回覆資料
router.get('/tweets/:tweet_id/replies', authenticated, tweetController.getReplies)
// 查詢推文的相關回覆量
router.get('/tweets/:tweet_id/replies/count', authenticated, tweetController.getRepliesCount)
// 取得推文按讚數、相關資訊
router.get('/tweets/:tweet_id/likes', authenticated, tweetController.getLikes)
// 新增推文
router.post('/tweets', authenticated, tweetController.postTweet)
// 新增回覆
router.post('/tweets/:tweet_id/replies', authenticated, tweetController.postReply)
// 修改推文
router.put('/tweets/:tweet_id', authenticated, tweetController.putTweet)
// 修改回覆
router.put('/replies/:reply_id', authenticated, tweetController.putReply)
// 刪除回覆
router.delete('/replies/:reply_id', authenticated, tweetController.deleteReply)
// Like
router.post('/tweets/:tweet_id/like', authenticated, tweetController.addLike)
// unLike
router.post('/tweets/:tweet_id/unlike', authenticated, tweetController.removeLike)


// admin
// JWT signin
router.post('/admin/signin', adminController.signIn)
// 搜尋使用者
router.get('/admin/users', authenticated, authenticatedAdmin, adminController.getUsers)
// 全部推文資料
router.get('/admin/tweets', authenticated, authenticatedAdmin, adminController.getTweets)
// 刪除一筆推文
router.delete('/admin/tweets/:tweet_id', authenticated, authenticatedAdmin, adminController.deleteTweet)

module.exports = router