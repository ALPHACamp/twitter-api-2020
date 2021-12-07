if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const router = express.Router()
const tweetController = require('../controller/apis/tweetController')
const userController = require('../controller/apis/userController')
const replyController = require('../controller/apis/replyController')
const adminController = require('../controller/apis/adminController')
const likeController = require('../controller/apis/likeController')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const {
  authenticated,
  authenticatedAdmin,
  authenticatedUser
} = require('../middleware/auth')

//tweet
router.post(
  '/tweets',
  authenticated,
  authenticatedUser,
  tweetController.postTweet
)
router.get(
  '/tweets',
  authenticated,
  authenticatedUser,
  tweetController.getTweets
)
router.get(
  '/tweets/:id',
  authenticated,
  authenticatedUser,
  tweetController.getTweet
)
router.put(
  '/tweets/:id',
  authenticated,
  authenticatedUser,
  tweetController.putTweet
)
router.delete(
  '/tweets/:id',
  authenticated,
  authenticatedUser,
  tweetController.deleteTweet
)
router.post(
  '/tweets/:id/like',
  authenticated,
  authenticatedUser,
  likeController.postLike
)
router.post(
  '/tweets/:id/unlike',
  authenticated,
  authenticatedUser,
  likeController.deleteLike
)
router.post(
  '/tweets/:id/replies',
  authenticated,
  authenticatedUser,
  replyController.postReply
)
router.get(
  '/tweets/:id/replies',
  authenticated,
  authenticatedUser,
  replyController.getReply
)
router.delete(
  '/replies/:replyId',
  authenticated,
  authenticatedUser,
  replyController.deleteReply
)

//JWT
router.post('/users', userController.signUp)

//user
router.post('/users/signin', userController.signIn)
router.put(
  '/users/account',
  authenticated,

  userController.accountSetting
)
router.put(
  '/users/:id',
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'cover', maxCount: 1 }
  ]),
  authenticated,

  userController.putUser
)
router.get(
  '/users/:id/tweets',
  authenticated,

  userController.getUserTweets
)
router.get(
  '/users/:id/replied_tweets',
  authenticated,

  userController.getUserReplies
)
router.get(
  '/users/:id/likes',
  authenticated,

  userController.getUserLike
)
router.get(
  '/users/:id/followings',
  authenticated,

  userController.getUserFollowings
)
router.get(
  '/users/:id/followers',
  authenticated,

  userController.getUserFollowers
)
router.get('/users', authenticated, userController.getUsers)
router.get(
  '/users/self',
  authenticated,

  userController.getCurrentUser
)
router.get(
  '/users/top',
  authenticated,

  userController.getTopUsers
)
router.get(
  '/users/:id',
  authenticated,

  userController.getUser
)

//followship
router.post(
  '/followships',
  authenticated,

  userController.postFollow
)
router.delete(
  '/followships/:id',
  authenticated,

  userController.deleteFollow
)

//admin
router.post('/admin/signin', adminController.signIn)
router.get(
  '/admin/users',
  authenticated,
  authenticatedAdmin,
  adminController.getUsers
)
router.get(
  '/admin/tweets',
  authenticated,
  authenticatedAdmin,
  adminController.getTweets
)
router.delete(
  '/admin/tweets/:id',
  authenticated,
  authenticatedAdmin,
  adminController.deleteTweet
)

module.exports = router
