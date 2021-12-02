if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const router = express.Router()
const tweetController = require('../controller/apis/tweetController')
const userController = require('../controller/apis/userController')
const replyController = require('../controller/apis/replyController')
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
router.post('/tweets', tweetController.postTweet)
router.get('/tweets', tweetController.getTweets)
router.get('/tweets/:id', tweetController.getTweet)
router.put('/tweets/:id', tweetController.putTweet)
router.delete('/tweets/:id', tweetController.deleteTweet)
router.post('/tweets/:id/replies', replyController.postReply)
router.get('/tweets/:id/replies', replyController.getReply)
router.delete('/replies/:replyId', replyController.deleteReply)

//JWT
router.post('/users', userController.signUp)

router.post('/users/signin', userController.signIn)
router.put('/users/:id', userController.putUser)
router.get('/users/:id/tweets', userController.getUserTweets)
router.get(
  '/users/:id/replied_tweets',

  userController.getUserReplies
)
router.get('/users/:id/likes', userController.getUserLike)
router.get(
  '/users/:id/followings',

  userController.getUserFollowings
)
router.get(
  '/users/:id/followers',

  userController.getUserFollowers
)
//user
router.get('/users', userController.getUsers)
router.get('/users/self', userController.getCurrentUser)
router.get('/users/:id', userController.getUser)
router.get('/users/:id/tweets', userController.getUserTweets)

module.exports = router
