// modules and files
const express = require('express')
const router = express.Router()
const passport = require('../config/passport.js')
const helpers = require('../_helpers.js')

// passport authentication
const authenticated = passport.authenticate('jwt', { session: false })
const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req)) {
    if (helpers.getUser(req).isAdmin) { return next() }
    return res.json({ status: 'error', message: '沒有權限' })
  } else {
    return res.json({ status: 'error', message: '沒有權限' })
  }
}

// call controller
const testController = require('../controllers/testController.js')
const userController = require('../controllers/userController.js')
const tweetController = require('../controllers/tweetController.js')

// test
router.get('/test', authenticated, authenticatedAdmin, testController.getTestData)

// user
router.post('/users', userController.signUp)
router.post('/login', userController.signIn)

// tweet
router.post('/tweets', authenticated, tweetController.postTweet) // 一定要加 authenticated 這個 middleware，否則後面拿不到 req.user

module.exports = router
