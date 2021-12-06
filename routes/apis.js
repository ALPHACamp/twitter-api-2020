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
const { authenticated, authenticatedAdmin } = require('../middleware/auth')

//tweet
router.post('/tweets', authenticated, tweetController.postTweet)
router.get('/tweets', authenticated, tweetController.getTweets)
router.get('/tweets/:id', authenticated, tweetController.getTweet)
router.put('/tweets/:id', authenticated, tweetController.putTweet)
router.delete('/tweets/:id', authenticated, tweetController.deleteTweet)
router.post('/tweets/:id/like', authenticated, likeController.postLike)
router.post('/tweets/:id/unlike', authenticated, likeController.deleteLike)
router.post('/tweets/:id/replies', authenticated, replyController.postReply)
router.get('/tweets/:id/replies', authenticated, replyController.getReply)
router.delete('/replies/:replyId', authenticated, replyController.deleteReply)

//JWT
router.post('/users', userController.signUp)

//user
router.post('/users/signin', userController.signIn)
router.put(
  '/users/:id',
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'cover', maxCount: 1 }
  ]),
  authenticated,
  userController.putUser
)
router.get('/users/:id/tweets', authenticated, userController.getUserTweets)
router.get(
  '/users/:id/replied_tweets',
  authenticated,
  userController.getUserReplies
)
router.get('/users/:id/likes', authenticated, userController.getUserLike)
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
router.get('/users/self', authenticated, userController.getCurrentUser)
router.get('/users/top', authenticated, userController.getTopUsers)
router.get('/users/:id', authenticated, userController.getUser)

//followship
router.post('/followships', authenticated, userController.postFollow)
router.delete('/followships/:id', authenticated, userController.deleteFollow)

//admin
router.get('/admin/users', authenticated, authenticatedAdmin, adminController.getUsers)
router.get('/admin/tweets', authenticated, authenticatedAdmin, adminController.getTweets)
router.delete('/admin/tweets/:id', authenticated, authenticatedAdmin, adminController.deleteTweet)

module.exports = router
