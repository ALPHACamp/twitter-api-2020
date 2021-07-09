const express = require('express')
const router = express.Router()
const passport = require('passport')
const helpers = require('../_helpers.js')

const userController = require('../controllers/userController.js')
const adminController = require('../controllers/adminController.js')
const tweetController = require('../controllers/tweetController.js')

// jwt驗證
const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      if (info.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Your token has expired." });
      } else {
        return res.status(401).json({ message: info.message });
      }
    }
    req.user = user;
    return next();
  })(req, res, next)
}
// 驗證登入者是否為管理者=>用於後台路由
const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req)) {
    if (helpers.getUser(req).role === 'admin') { return next() }
    return res.json({ status: 'error', message: '非管理者沒有權限登入後台！' })
  } else {
    return res.json({ status: 'error', message: '未通過身份驗證！' })
  }
}
// 驗證登入者是否為非管理者=>用於前台路由
const authenticatedNotAdmin = (req, res, next) => {
  if (helpers.getUser(req)) {
    if (helpers.getUser(req).role !== 'admin') { return next() }
    return res.json({ status: 'error', message: '管理者沒有權限登入前台！' })
  } else {
    return res.json({ status: 'error', message: '未通過身份驗證！' })
  }
}

// user routes
router.post('/users', userController.signUp)
router.post('/signin', userController.signIn)
router.get('/users/:id', authenticated, authenticatedNotAdmin, userController.getUser)
router.put('/users/:id', authenticated, authenticatedNotAdmin, userController.putUser)

// admin routes
router.post('/admin/signin', adminController.signIn)
// router.get('/admin/users', adminController.getUsers)
router.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
router.delete('/admin/tweets/:id', adminController.deleteTweet)

// tweet routes
router.get('/tweets', authenticatedNotAdmin, tweetController.getTweets)
router.post('/tweets', authenticatedNotAdmin, tweetController.postTweet)

module.exports = router
