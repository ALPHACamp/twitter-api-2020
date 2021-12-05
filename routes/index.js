const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const userController = require('../controllers/userController')
const tweetController = require('../controllers/tweetController')


// const authenticated = (req, res, next) => {
//   if (req.isAuthenticated()) {
//     return next()
//   }
//   res.redirect('/api/signin')
// }
const authenticated = passport.authenticate('jwt', { session: false })

const authenticatedAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.role === "admin") { return next() }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}


//user相關
router.post('/api/users/signin', userController.signIn)
router.post('/api/users', userController.signUp)

//user編輯個人帳號
router.get('/api/users/account/:id', userController.getUserAccountSetting)
router.put('/api/users/account/:id', userController.putUserAccountSetting)
//router.get('/api/users/:userId', userController.getUser)(待討論)
//user編輯個人資料
router.get('/api/users/edit/:id', userController.getUserInfo)
router.put('/api/users/edit/:id', userController.editUserInfo)
//user觀看特定人士已like
router.get('/api/users/:id/likes', userController.getOneLikes)

//先讓前端使用的get_current)user
router.get('/get_current_user', userController.getCurrentUser)




//tweets相關  待加上authenticated,
router.get('/api/tweets', authenticated, tweetController.getTweets)
router.get('/api/tweets/:id', authenticated, tweetController.getTweet)
router.post('/api/tweets', authenticated, tweetController.postTweet)




//likes相關







//replies相關



//followships相關









//admin相關

module.exports = router
