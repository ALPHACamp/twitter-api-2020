/* necessary */
const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
/* Controller */
const userController = require('../controllers/api/userController')
const tweetController = require('../controllers/api/tweetController')

/* authenticated */
const authenticated = passport.authenticate('jwt', { session: false })
const authenticatedAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.isAdmin) {
      return next()
    }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

// front desk
// signin
router.post('/login', userController.signIn)
// signUp
router.post('/users', userController.signUp)

// tweet
router.get('/tweets/', authenticated, tweetController.getTweets)
router.post('/tweets/', authenticated, tweetController.postTweet)
router.get('/tweets/:id', authenticated, tweetController.getTweets)

module.exports = router
