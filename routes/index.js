const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const helpers = require('../_helpers')
const userController = require('../controllers/userController')
const tweetController = require('../controllers/tweetController')
const replyController = require('../controllers/replyController')
const likeController = require('../controllers/likeController')
const followController = require('../controllers/followController')
const adminController = require('../controllers/adminController')
const cors = require('cors')
// const authenticated = (req, res, next) => {
//   if (req.isAuthenticated()) {
//     return next()
//   }
//   res.redirect('/api/signin')
// }
router.use(cors())
const authenticated = passport.authenticate('jwt', { session: false })

const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req).role === "") {
    return res.status(401).json({ status: 'error', message: 'permission denied' })
  }
  return next()
}

const checkNotUser = (req, res, next) => {
  if (helpers.getUser(req).role === "admin") {
    return res.status(401).json({ status: 'error', message: 'permission denied' })
  }
  return next()
}


//user相關
router.post('/api/users/signin', userController.signIn)
router.post('/api/users', userController.signUp)

//user取得編輯個人帳號資訊
router.get('/api/users/account', authenticated, checkNotUser, userController.getUserAccountSetting)
//user編輯個人帳號
router.put('/api/users/account', authenticated, checkNotUser, userController.putUserAccountSetting)
//router.get('/api/users/:userId', userController.getUser)(待討論)
//user取得編輯個人資訊頁面
router.get('/api/users/edit', authenticated, checkNotUser, userController.getUserInfo)
//user編輯個人資訊頁面
router.put('/api/users', authenticated, checkNotUser, userController.editUserInfo)
//user觀看特定人士已like
router.get('/api/users/:id/likes', authenticated, checkNotUser, userController.getOneLikes)
//user觀看特定人士已reply
router.get('/api/users/:id/replied_tweets', authenticated, checkNotUser, userController.getOneRepliedTweets)
//user觀看特定人士tweets
router.get('/api/users/:id/tweets', authenticated, checkNotUser, userController.getOneTweets)

router.get('/api/users/:id/followers', authenticated, checkNotUser, userController.getOneFollowers)
router.get('/api/users/:id/followings', authenticated, checkNotUser, userController.getOneFollowings)

//先讓前端使用的get_current)user
router.get('/api/get_current_user', authenticated, checkNotUser, userController.getCurrentUser)




//tweets相關
router.get('/api/tweets', authenticated, checkNotUser, tweetController.getTweets)
router.get('/api/tweets/:id', authenticated, checkNotUser, tweetController.getTweet)
router.post('/api/tweets', authenticated, checkNotUser, tweetController.postTweet)


//likes相關
router.post('/api/tweets/:tweetId/like', authenticated, checkNotUser, likeController.postLike)
router.post('/api/tweets/:tweetId/unlike', authenticated, checkNotUser, likeController.postUnlike)


//replies相關
router.get('/api/tweets/:tweetId/replies', authenticated, checkNotUser, replyController.getReplies)
router.post('/api/tweets/:tweetId/replies', authenticated, checkNotUser, replyController.postReply)


//followships相關
router.post('/api/followships', authenticated, checkNotUser, followController.addFollowship)
router.delete('/api/followships/:followingId', authenticated, checkNotUser, followController.deleteFollowship)
router.get('/api/followers/top', authenticated, checkNotUser, followController.getTopFollowers)


//admin相關
router.get('/api/admin/users', authenticated, authenticatedAdmin, adminController.getUsers)
router.post('/api/admin/signin', userController.adminSignIn)
router.get('/api/admin/tweets', authenticated, authenticatedAdmin, adminController.getAdminTweets)
router.delete('/api/admin/tweets/:id', authenticated, authenticatedAdmin, adminController.deleteTweet)

module.exports = router

