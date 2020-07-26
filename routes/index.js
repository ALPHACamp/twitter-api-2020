// modules and files
const express = require('express')
const router = express.Router()
const passport = require('../config/passport.js')
const helpers = require('../_helpers.js')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

// passport authentication
const authenticated = passport.authenticate('jwt', { session: false })
// const authenticated = (req, res, next) => { next() } // 測試時，開啟這條即可，不用取消下方的 authenticated
const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req)) {
    if (helpers.getUser(req).isAdmin) { return next() }
    return res.json({ status: 'error', message: '沒有權限' })
  } else {
    return res.json({ status: 'error', message: '沒有權限' })
  }
}

// call controller
const testController = require('../controllers/testController.js')
const userController = require('../controllers/userController.js')
const tweetController = require('../controllers/tweetController.js')
const replyController = require('../controllers/replyController.js')
const followshipController = require('../controllers/followshipController.js')

// test
router.get('/test', authenticated, authenticatedAdmin, testController.getTestData)

// user
router.post('/users', userController.signUp)
router.post('/login', userController.signIn)
router.get('/users/:id', authenticated, userController.getUser)
router.put('/users/:id', authenticated, userController.putUser)
router.put('/users/:id/profile', authenticated, upload.fields([{ name: 'avatar' }, { name: 'cover' }]), userController.putUserProfile) // 上傳兩張圖片
router.get('/users/:id/tweets', authenticated, userController.getUserTweets)

// 需驗證的路由，一定要加 authenticated 這個 middleware，否則後面拿不到 helpers.getUser(req)（等同於 req.user）
// tweet
router.post('/tweets', authenticated, tweetController.postTweet)
router.get('/tweets/:tweet_id', authenticated, tweetController.getTweet)
router.get('/tweets', authenticated, tweetController.getTweets)

// reply
router.post('/tweets/:tweet_id/replies', authenticated, replyController.postReply)
router.get('/tweets/:tweet_id/replies', authenticated, replyController.getReplies)
router.delete('/tweets/:tweet_id/replies/:reply_id', authenticated, replyController.deleteReply)

// followship
router.post('/followships', authenticated, followshipController.postFollowship)
router.delete('/followships/:followingId', authenticated, followshipController.deleteFollowship)

// like
router.post('/tweets/:id/like', authenticated, tweetController.addTweetLike)
router.post('/tweets/:id/unlike', authenticated, tweetController.removeTweetLike)
router.post('/replies/:id/like', authenticated, replyController.addReplyLike)
router.post('/replies/:id/unlike', authenticated, replyController.removeReplyLike)

module.exports = router
