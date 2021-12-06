const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const passport = require('../config/passport')
const helpers = require('../_helpers')

const adminController = require('../controllers/api/adminControllers')
const userController = require('../controllers/api/userControllers')
const tweetController = require('../controllers/api/tweetControllers')
const replyController = require('../controllers/api/replyController')

function authenticated (req, res, next) {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) next(err)
    if (!user) {
      return res.json({
        status: 'error',
        message: '帳號不存在！'
      })
    }
    req.user = user
    return next()
  })(req, res, next)
}

function authenticatedAdmin (req, res, next) {
  if (helpers.getUser(req)) {
    if ((helpers.getUser(req).role = 'admin')) {
      return next()
    }
    return res.json({ status: 'error', message: '帳號不存在！' })
  } else {
    return res.json({ status: 'error', message: '帳號不存在！' })
  }
}

const uploadImage = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }])

router.get('/users/top', authenticated, userController.getTopUser)
router.get('/users/:id/followings', authenticated, userController.getUserFollowings)
router.get('/users/:id/followers', authenticated, userController.getUserFollowers)
router.get('/users/:id/replied_tweets', authenticated, userController.getUserReplies)
router.get('/users/:id', authenticated, userController.getUser)
router.put('/users/:id/setting', authenticated, userController.putUserSetting)
router.put('/users/:id', authenticated, uploadImage, userController.putUser)
router.get('/users/:id/tweets', authenticated, userController.getUserTweets)
router.get('/users/:id/likes', authenticated, userController.getUserLikes)

router.get('/users', authenticated, userController.getUsers)
router.get('/tweets', authenticated, tweetController.getTweets)
router.post('/tweets', authenticated, tweetController.postTweet)
router.get('/tweets/:tweet_id', authenticated, tweetController.getTweet)
router.post('/tweets/:tweet_id/replies', authenticated, replyController.postReply)
router.get('/tweets/:tweet_id/replies', authenticated, replyController.getReply)
router.post('/tweets/:tweet_id/like', authenticated, tweetController.likeTweet)
router.post('/tweets/:tweet_id/unlike', authenticated, tweetController.unlikeTweet)

router.post('/followships', authenticated, userController.addFollowing)
router.delete('/followships/:followingId', authenticated, userController.removeFollowing)
router.post('/notice', authenticated, userController.addNoticing)
router.delete('/notice/:noticeId', authenticated, userController.removeNoticing)

router.post('/admin/signin', adminController.signIn)
router.get('/admin/users', authenticated, authenticatedAdmin, adminController.getUsers)
router.get('/admin/tweets', authenticated, authenticatedAdmin, adminController.getTweets)
router.delete('/admin/tweets/:id', authenticated, authenticatedAdmin, adminController.deleteTweet)

router.post('/signin', userController.signIn)
router.post('/users', userController.signUp)

module.exports = router
