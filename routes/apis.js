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
const passport = require('passport')

//function
let authenticated = passport.authenticate('jwt', { session: false })

const authenticatedAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.role === 'Admin') {
      return next()
    }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

//tweet
router.post('/tweets', authenticated, tweetController.postTweet)
router.get('/tweets', authenticated, tweetController.getTweets)
router.get('/tweets/:id', authenticated, tweetController.getTweet)
router.put('/tweets/:id', authenticated, tweetController.putTweet)
router.delete('/tweets/:id', authenticated, tweetController.deleteTweet)
router.post('/tweets/:id/replies', authenticated, replyController.postReply)
router.get('/tweets/:id/replies', authenticated, replyController.getReply)
router.delete('/replies/:replyId', authenticated, replyController.deleteReply)

//JWT

router.post('/users', userController.signUp)

router.post('/users/signin', userController.signIn)
router.put('/users/:id', authenticated, userController.putUser)
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
//user
router.get('/users', authenticated, userController.getUsers)
router.get('/users/self', authenticated, userController.getCurrentUser)
router.get('/users/:id', authenticated, userController.getUser)

//followship
router.post('/followships', authenticated, userController.postFollow)
router.delete('/followships/:id', authenticated, userController.deleteFollow)

//admin
router.get('/admin/users', authenticated, adminController.getUsers)
router.delete('/admin/tweets/:id', authenticated, adminController.deleteTweet)

router.post('/users/tweets/:id/like', authenticated, likeController.postLike)
router.post(
  '/users/tweets/:id/unlike',
  authenticated,
  likeController.deleteLike
)

module.exports = router
