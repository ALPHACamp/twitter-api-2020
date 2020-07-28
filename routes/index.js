// modules and files
const express = require('express')
const router = express.Router()
const passport = require('../config/passport.js')
const helpers = require('../_helpers.js')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

// passport authentication
const authenticated = passport.authenticate('jwt', { session: false })
const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req)) {
    if (helpers.getUser(req).role === '1') { return next() }
    return res.json({ status: 'error', message: '沒有權限' })
  } else {
    return res.json({ status: 'error', message: '沒有權限' })
  }
}
const adminBlocker = (req, res, next) => {
  if (helpers.getUser(req)) {
    if (helpers.getUser(req).role === '1') {
      return res.json({ status: 'error', message: 'admin 沒有權限' })
    } else {
      return next()
    }
  }
}

// call controller
const testController = require('../controllers/testController.js')
const userController = require('../controllers/userController.js')
const tweetController = require('../controllers/tweetController.js')
const replyController = require('../controllers/replyController.js')
const followshipController = require('../controllers/followshipController.js')
const adminController = require('../controllers/adminController.js')

// test
router.get('/test', authenticated, adminBlocker, testController.getTestData)

// admin
router.get('/admin/users', authenticated, authenticatedAdmin, adminController.getAllUsers)
router.get('/admin/tweets', authenticated, authenticatedAdmin, adminController.getAllTweets)
router.delete('/admin/tweets/:tweet_id', authenticated, authenticatedAdmin, adminController.deleteTweet)

// user
router.post('/users', userController.signUp)
router.post('/login', userController.signIn)
router.put('/users/:id/settings', authenticated, adminBlocker, userController.putUser)
router.get('/users/:id/tweets', authenticated, adminBlocker, userController.getUserTweets)
router.get('/users/:id/followings', authenticated, adminBlocker, userController.getUserFollowings)
router.get('/users/:id/followers', authenticated, adminBlocker, userController.getUserFollowers)
router.get('/users/:id/replied_tweets', authenticated, adminBlocker, userController.getRepliedTweets)
router.get('/users/:id/likes', authenticated, adminBlocker, userController.getLikedTweets)
router.get('/users/:id', authenticated, adminBlocker, userController.getUser)
router.put('/users/:id', authenticated, adminBlocker, upload.fields([{ name: 'avatar' }, { name: 'cover' }]), userController.putUserProfile) // 上傳兩張圖片

// 需驗證的路由，一定要加 authenticated 這個 middleware，否則後面拿不到 helpers.getUser(req)（等同於 req.user）
// tweet
router.post('/tweets', authenticated, adminBlocker, tweetController.postTweet)
router.get('/tweets/:tweet_id', authenticated, adminBlocker, tweetController.getTweet)
router.get('/tweets', authenticated, adminBlocker, tweetController.getTweets)

// reply
router.post('/tweets/:tweet_id/replies', authenticated, adminBlocker, replyController.postReply)
router.get('/tweets/:tweet_id/replies', authenticated, adminBlocker, replyController.getReplies)
router.delete('/tweets/:tweet_id/replies/:reply_id', authenticated, adminBlocker, replyController.deleteReply)

// followship
router.post('/followships', authenticated, adminBlocker, followshipController.postFollowship)
router.delete('/followships/:followingId', authenticated, adminBlocker, followshipController.deleteFollowship)

// like
router.post('/tweets/:id/like', authenticated, adminBlocker, tweetController.addTweetLike)
router.post('/tweets/:id/unlike', authenticated, adminBlocker, tweetController.removeTweetLike)
router.post('/replies/:id/like', authenticated, adminBlocker, replyController.addReplyLike)
router.post('/replies/:id/unlike', authenticated, adminBlocker, replyController.removeReplyLike)

module.exports = router
