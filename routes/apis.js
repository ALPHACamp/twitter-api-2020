const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

// const authenticated = passport.authenticate('jwt', { session: false })
const authenticated = function (req, res, next) {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (!user) {
      return res
        .status(401)
        .json({ status: 'error', message: 'No auth token' })
    }
    req.user = user
    return next()
  })(req, res, next)
}

const authenticatedAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.role === 'Admin') { return next() }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

const tweetController = require('../controllers/tweetController')
const userController = require('../controllers/userController')
const replyController = require('../controllers/replyController')

//登入登出註冊
router.post('/signin', userController.signIn)
router.post('/users', userController.signUp)
router.get('/', authenticated, (req, res) => res.render('tweets'))

//tweets
router.get('/tweets', authenticated, tweetController.getTweets)
router.get('/tweets/:tweet_id', authenticated, tweetController.getTweet)
router.post('/tweets', authenticated, tweetController.postTweet)
router.put('/tweets/:tweet_id', authenticated, tweetController.putTweet)

//replies
router.post('/tweets/:tweet_id/replies', authenticated, replyController.postReply)
router.get('/tweets/:tweet_id/replies', authenticated, replyController.getReply)

//like
router.post('/tweets/:id/like', authenticated, userController.likeTweet)
router.post('/tweets/:id/unlike', authenticated, userController.unlikeTweet)

//user
router.get('/users/:id/replied_tweets', authenticated, userController.getUserReplies)
router.get('/users/:id/likes', authenticated, userController.getUserLikes)
router.get('/users/:id/setting', authenticated, userController.getSettingPage)
module.exports = router