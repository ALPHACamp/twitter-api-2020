const express = require('express');
const router = express.Router();

const tweetController = require('../controllers/tweetController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')
const passport = require('../config/passport')

const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.role === 'admin') { return next() }
    return res.redirect('/')
  }
  res.redirect('/signin')
}

//如果使用者訪問首頁，就導向 /tweets 的頁面
router.get('/', authenticated, (req, res) => res.redirect('/tweets'))

//在 /tweets 底下則交給 tweetController.getTweets 來處理
router.get("/tweets", authenticated, tweetController.getTweets);

// 連到 /admin 頁面就轉到 /admin/tweets
router.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/tweets'))
//  使用者新增一篇推文
router.post("/tweets", authenticated, tweetController.postTweet);

// 在 /admin/tweets 底下則交給 adminController.getTweets 處理
router.get('/admin/tweets', adminController.getTweets)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)

// router.get('/', authenticated, (req, res) => res.redirect('/tweets'))




router.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/tweets'))
router.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)

module.exports = router