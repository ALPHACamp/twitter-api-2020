const express = require('express')
const router = express.Router()
const passport = require('passport')
const helpers = require('../_helpers.js')
const { User } = require('../models')

const userController = require('../controllers/userController.js')
const adminController = require('../controllers/adminController.js')
const followshipController = require('../controllers/followshipController.js')
const likeController = require('../controllers/likeController.js')
const tweetController = require('../controllers/tweetController.js')
const replyController = require('../controllers/replyController.js')

// jwt驗證
const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, async (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      if (info.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Your token has expired." });
      } else {
        return res.status(401).json({ message: info.message });
      }
    }
    user = await User.findByPk(user.dataValues.id, {
      include: [
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
    req.user = user.dataValues;
    return next();
  })(req, res, next)
}
// 驗證登入者是否為管理者=>用於後台路由
const authenticatedAdmin = (req, res, next) => {
  console.log(req.user)
  if (req.user) {
    if (req.user.role === 'admin') { return next() }
    return res.json({ status: 'error', message: '非管理者沒有權限登入後台！' })
  } else {
    return res.json({ status: 'error', message: '未通過身份驗證！' })
  }
}
// 驗證登入者是否為非管理者=>用於前台路由
const authenticatedNotAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.role !== 'admin') { return next() }
    return res.json({ status: 'error', message: '管理者沒有權限登入前台！' })
  } else {
    return res.json({ status: 'error', message: '未通過身份驗證！' })
  }
}

// user routes
router.post('/users', userController.signUp)
router.post('/signin', userController.signIn)
router.get('/users/top', authenticated, authenticatedNotAdmin, userController.getTopFollowedUsers)
router.get('/users/:id', authenticated, authenticatedNotAdmin, userController.getUser)
router.get('/users/:id/replied_tweets', authenticated, authenticatedNotAdmin, userController.getReplies)
router.get('/users/:id/tweets', authenticated, authenticatedNotAdmin, userController.getTweets)
router.get('/users/:id/followings', authenticated, authenticatedNotAdmin, userController.getFollowings)
router.get('/users/:id/followers', authenticated, authenticatedNotAdmin, userController.getFollowers)


// admin routes
router.post('/admin/signin', adminController.signIn)
router.get('/admin/users', authenticated, authenticatedAdmin, adminController.getUsers)
router.get('/admin/tweets', authenticated, authenticatedAdmin, adminController.getTweets)
router.delete('/admin/tweets/:id', authenticatedAdmin, adminController.deleteTweet)

// followship routes
router.post('/followships', authenticated, authenticatedNotAdmin, followshipController.addFollowing)
router.delete('/followships/:followingId', authenticated, authenticatedNotAdmin, followshipController.removeFollowing)

// like route
router.post('/tweets/:id/like', authenticated, authenticatedNotAdmin, likeController.addLike)
router.post('/tweets/:id/unlike', authenticated, authenticatedNotAdmin, likeController.removeLike)

// tweet routes
router.get('/tweets', authenticated, authenticatedNotAdmin, tweetController.getTweets)
router.get('/tweets/:id', authenticated, authenticatedNotAdmin, tweetController.getTweet)
router.post('/tweets', authenticated, authenticatedNotAdmin, tweetController.postTweet)

// reply routes
router.post('/tweets/:tweet_id/replies', authenticated, authenticatedNotAdmin, replyController.postReply)
router.get('/tweets/:tweet_id/replies', authenticated, authenticatedNotAdmin, replyController.getReplies)

module.exports = router
