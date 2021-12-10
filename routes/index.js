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
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const cors = require('cors')
router.use(cors())

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) { return next(err) }
    if (!user) {
      return res.status(401).json({ status: 'error', message: '請登入瀏覽網站' })
    }
    req.user = user
    return next()
  })(req, res, next)
}

const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === null) {
      return res.status(401).json({ status: 'error', message: '請勿瀏覽後台頁面' })
    }
    return next()
  }
  return res.json({ status: 'error', message: '請登入瀏覽網站' })
}

const authenticatedUser = (req, res, next) => {
  if (helpers.getUser(req).role === "admin") {
    return res.status(401).json({ status: 'error', message: '請勿瀏覽前台頁面' })
  }
  return next()
}


//user相關
router.post('/api/users/signin', userController.signIn)
router.post('/api/users', userController.signUp)

//user取得編輯個人帳號資訊
router.get('/api/users/account', authenticated, authenticatedUser, userController.getUserAccountSetting)
//user編輯個人帳號
router.put('/api/users/account', authenticated, authenticatedUser, userController.putUserAccountSetting)
//router.get('/api/users/:userId', userController.getUser)(待討論)
//user取得編輯個人資訊頁面
router.get('/api/users/edit', authenticated, authenticatedUser, userController.getUserInfo)
//user編輯個人資訊頁面

router.put('/api/users', authenticated, authenticatedUser, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), userController.editUserInfo)
router.get('/api/users/:id', authenticated, authenticatedUser, userController.getUserProfile)
router.put('/api/users/:id', authenticated, authenticatedUser, userController.editUserInfo)

//user觀看特定人士已like
router.get('/api/users/:id/likes', authenticated, authenticatedUser, userController.getOneLikes)
//user觀看特定人士已reply
router.get('/api/users/:id/replied_tweets', authenticated, authenticatedUser, userController.getOneRepliedTweets)
//user觀看特定人士tweets
router.get('/api/users/:id/tweets', authenticated, authenticatedUser, userController.getOneTweets)

router.get('/api/users/:id/followers', authenticated, authenticatedUser, userController.getOneFollowers)
router.get('/api/users/:id/followings', authenticated, authenticatedUser, userController.getOneFollowings)

//先讓前端使用的get_current)user
router.get('/api/get_current_user', authenticated, userController.getCurrentUser)





//tweets相關
router.get('/api/tweets', authenticated, authenticatedUser, tweetController.getTweets)
router.get('/api/tweets/:id', authenticated, authenticatedUser, tweetController.getTweet)
router.post('/api/tweets', authenticated, authenticatedUser, tweetController.postTweet)


//likes相關
router.post('/api/tweets/:tweetId/like', authenticated, authenticatedUser, likeController.postLike)
router.post('/api/tweets/:tweetId/unlike', authenticated, authenticatedUser, likeController.postUnlike)


//replies相關
router.get('/api/tweets/:tweetId/replies', authenticated, authenticatedUser, replyController.getReplies)
router.post('/api/tweets/:tweetId/replies', authenticated, authenticatedUser, replyController.postReply)


//followships相關
router.post('/api/followships', authenticated, authenticatedUser, followController.addFollowship)
router.delete('/api/followships/:followingId', authenticated, authenticatedUser, followController.deleteFollowship)
router.get('/api/followers/top', authenticated, authenticatedUser, followController.getTopFollowers)


//admin相關
router.get('/api/admin/users', authenticated, authenticatedAdmin, adminController.getUsers)
router.post('/api/admin/signin', userController.adminSignIn)
router.get('/api/admin/tweets', authenticated, authenticatedAdmin, adminController.getAdminTweets)
router.delete('/api/admin/tweets/:id', authenticated, authenticatedAdmin, adminController.deleteTweet)

module.exports = router

