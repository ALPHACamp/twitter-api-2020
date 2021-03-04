const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const authenticated = passport.authenticate('jwt', { session: false })
// import controller
const userController = require('../controllers/api/userController')
const adminController = require('../controllers/api/adminController')
const tweetController = require('../controllers/api/tweetController')
const tweetService = require('../services/tweetService')

// admin權限認證
const authenticatedAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.role === 'admin') {
      return next()
    }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

// user
router.post('/signin', authenticated, userController.getUser)


// tweet
router.get('/tweets', authenticated, tweetController.getTweets)
router.get('/tweets/:id', authenticated, tweetController.getTweet)
router.post('/tweets', authenticated, tweetController.postTweet)
router.post('/tweets/:id/replies', authenticated, tweetController.postReply)
router.post('/tweets/:id/like', authenticated, tweetController.addLike)
router.post('/tweets/:id/unlike', authenticated, tweetController.removeLike)

// admin
// JWT signin
router.post('/admin/signin', adminController.signIn)
// 搜尋使用者
router.get('/admin/users', authenticated, authenticatedAdmin, adminController.getUsers)
// 全部推文資料
router.get('/admin/tweets', authenticated, authenticatedAdmin, adminController.getTweets)
// 刪除一筆推文
router.delete('/admin/tweets/:id', authenticated, authenticatedAdmin, adminController.deleteTweet)

module.exports = router