const express = require('express')
const router = express.Router()

const { authenticated, authenticatedAdmin } = require('../middleware/auth')

const userController = require('../controllers/userController.js')
const adminController = require('../controllers/adminController.js')
const tweetController = require('../controllers/tweetController')
const replyController = require('../controllers/replyController')
const likeController = require('../controllers/likeController')
const followshipController = require('../controllers/followshipController')

// 前台 Login
router.post('/login', userController.logIn)
// 註冊
router.post('/users', userController.register)

// 後台 Login
router.post('/adminLogin', adminController.adminLogIn)
// 後台：取得所有使用者資料
router.get(
  '/admin/users',
  authenticated,
  authenticatedAdmin,
  adminController.getAllUsers
)
// 後台：取得所有 tweets
router.get(
  '/admin/tweets',
  authenticated,
  authenticatedAdmin,
  tweetController.getTweets
)
// 後台：刪除單一 tweet
router.delete(
  '/admin/tweets/:id',
  authenticated,
  authenticatedAdmin,
  adminController.deleteTweet
)

router.get('/tweets', authenticated, tweetController.getTweets)
router.get('/tweets/:tweet_id', authenticated, tweetController.getTweet)
router.post('/tweets', authenticated, tweetController.postTweet)

router.post('/tweets/:tweet_id/replies', authenticated, replyController.postReply)
router.get('/tweets/:tweet_id/replies', authenticated, replyController.getReply)

router.post('/tweets/:tweet_id/like', authenticated, likeController.like)
router.post('/tweets/:tweet_id/unlike', authenticated, likeController.unlike)

router.post('/followships', authenticated, followshipController.addFollowing)
router.delete('/followships/:followingId', authenticated, followshipController.removeFollowing)

// 前台：取得登入中使用者
router.get('/current_user', authenticated, userController.getCurrentUser)
// 前台：取得特定使用者資料
router.get('/users/:user_id', authenticated, userController.getUser)
router.get('/users/:id/tweets', authenticated, userController.getTweets)
router.get('/users/:id/replied_tweets', authenticated, userController.getRepliedTweets)
router.get('/users/:id/likes', authenticated, userController.getLikedTweets)
router.get('/users/:id/followings', authenticated, userController.getFollowingUsers)
router.get('/users/:id/followers', authenticated, userController.getFollowerUsers)

module.exports = router
