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

// call controller
const testController = require('../controllers/testController.js')
const userController = require('../controllers/userController.js')
const tweetController = require('../controllers/tweetController.js')
const replyController = require('../controllers/replyController.js')
const followshipController = require('../controllers/followshipController.js')
const adminController = require('../controllers/adminController.js')

// test
router.get('/test', authenticated, authenticatedAdmin, testController.getTestData)

// admin (無法通過 authenticatedAdmin 驗證)
router.get('/admin/users', authenticated, authenticatedAdmin, adminController.getAllUsers)
router.get('/admin/tweets', authenticated, authenticatedAdmin, adminController.getAllTweets)
router.delete('/admin/tweets/:tweet_id', authenticated, authenticatedAdmin, adminController.deleteTweet)

// user
router.post('/users', userController.signUp)
router.post('/login', userController.signIn)
router.put('/users/:id/setting', authenticated, userController.putUser)
router.get('/users/:id/tweets', authenticated, userController.getUserTweets)
router.get('/users/:id/followings', authenticated, userController.getUserFollowings)
router.get('/users/:id/followers', authenticated, userController.getUserFollowers)
router.get('/users/:id/replied_tweets', authenticated, userController.getRepliedTweets)
router.get('/users/:id/likes', authenticated, userController.getLikedTweets)
router.get('/users/:id', authenticated, userController.getUser)
router.put('/users/:id', authenticated, upload.fields([{ name: 'avatar' }, { name: 'cover' }]), userController.putUserProfile) // 上傳兩張圖片

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
