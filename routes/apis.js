const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const helpers = require('../_helpers')

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
  if (helpers.getUser(req)) {
    if (helpers.getUser(req).role === 'admin') { return next() }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

const adminController = require('../controllers/adminController.js')
const tweetController = require('../controllers/tweetController')
const userController = require('../controllers/userController')
const replyController = require('../controllers/replyController')
const followshipController = require('../controllers/followshipController')

//登入登出註冊
router.post('/signin', userController.signIn)
router.post('/users', userController.signUp)
router.get('/', authenticated, (req, res) => res.render('tweets'))
router.get('/get_current_user', authenticated, userController.getCurrentUser)

//tweets
router.get('/tweets', authenticated, tweetController.getTweets)
router.get('/tweets/:tweet_id', authenticated, tweetController.getTweet)
router.post('/tweets', authenticated, tweetController.postTweet)
router.put('/tweets/:tweet_id', authenticated, tweetController.putTweet)

//replies
router.post('/tweets/:tweet_id/replies', authenticated, replyController.postReply)
router.get('/tweets/:tweet_id/replies', authenticated, replyController.getReply)
router.get('/replies/:reply_id', authenticated, replyController.getSingleReply)

//like
router.post('/tweets/:id/like', authenticated, userController.likeTweet)
router.post('/tweets/:id/unlike', authenticated, userController.unlikeTweet)

//user

router.get('/users/top', authenticated, userController.getTopUsers)

router.put('/users/:id', authenticated, upload.fields([{ name: 'avatar' }, { name: 'cover' }]), userController.putProfile)
router.get('/users/:id/replies', authenticated, userController.getUserReplies)
router.get('/users/:id/followings', authenticated, userController.getFollowings)
router.get('/users/:id/followers', authenticated, userController.getFollowers)
router.get('/users/:id/tweets', authenticated, userController.getTweets)
router.get('/users/:id/replied_tweets', authenticated, userController.getUserReplies)
router.get('/users/:id/likes', authenticated, userController.getUserLikes)
router.get('/users/:id/setting', authenticated, userController.getSettingPage)
router.put('/users/:id/setting', authenticated, userController.putSetting)
router.get('/users/:id', authenticated, userController.getProfile)
//followship
router.post('/followships', authenticated, followshipController.addFollowing)
router.delete('/followships/:followingId', authenticated, followshipController.removeFollowing)

// admin
router.get('/admin/tweets', authenticated, authenticatedAdmin, adminController.getTweets)
router.get('/admin/users', authenticated, authenticatedAdmin, adminController.getUsers)
router.delete('/admin/tweets/:id', authenticated, authenticatedAdmin, adminController.deleteTweet)

module.exports = router