const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const helpers = require('../_helpers')
const userController = require('../controllers/userController')
const tweetController = require('../controllers/tweetController')
const replyController = require('../controllers/replyController')
const likeController = require('../controllers/likeController')
const followController = require('../controllers/followController')

// const authenticated = (req, res, next) => {
//   if (req.isAuthenticated()) {
//     return next()
//   }
//   res.redirect('/api/signin')
// }
const authenticated = passport.authenticate('jwt', { session: false })

const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req)) {
    if (helpers.getUser(req).role === "admin") { return next() }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}


//user相關
router.post('/api/users/signin', userController.signIn)
router.post('/api/users', userController.signUp)

//user取得編輯個人帳號資訊
router.get('/api/users/account', authenticated, userController.getUserAccountSetting)
//user編輯個人帳號
router.put('/api/users/account', authenticated, userController.putUserAccountSetting)
//router.get('/api/users/:userId', userController.getUser)(待討論)
//user取得編輯個人資訊頁面
router.get('/api/users/edit', authenticated, userController.getUserInfo)
//user編輯個人資訊頁面
router.put('/api/users/edit', authenticated, userController.editUserInfo)
//user觀看特定人士已like
router.get('/api/users/:id/likes', authenticated, userController.getOneLikes)
//user觀看特定人士已reply
router.get('/api/users/:id/replied_tweets', authenticated, userController.getOneRepliedTweets)
//user觀看特定人士tweets
router.get('/api/users/:id/tweets', authenticated, userController.getOneTweets)

router.get('/api/users/:id/followers', authenticated, userController.getOneFollowers)
router.get('/api/users/:id/followings', authenticated, userController.getOneFollowings)

//先讓前端使用的get_current)user
router.get('/get_current_user', authenticated, userController.getCurrentUser)




//tweets相關
router.get('/api/tweets', authenticated, tweetController.getTweets)
router.get('/api/tweets/:id', authenticated, tweetController.getTweet)
router.post('/api/tweets', authenticated, tweetController.postTweet)
router.get('/api/admin/tweets',authenticated, authenticatedAdmin, tweetController.getAdminTweets)
router.delete('/api/admin/tweets/:id', authenticated, authenticatedAdmin, tweetController.deleteTweet)


//likes相關   待補authenticated
router.post('/api/tweets/:tweetId/like', authenticated, likeController.postLike)
router.post('/api/tweets/:tweetId/unlike', authenticated, likeController.postUnlike)


//replies相關
router.get('/api/tweets/:tweetId/replies', authenticated, replyController.getReplies)
router.post('/api/tweets/:tweetId/replies', authenticated, replyController.postReply)

//followships相關
router.post('/api/followships', authenticated, followController.addFollowship)
router.delete('/api/followships/:followingId', authenticated, followController.deleteFollowship)







//admin相關

module.exports = router
