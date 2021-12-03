/* necessary */
const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const helpers = require('../_helpers')
/* Controller */
const userController = require('../controllers/api/userController')
const tweetController = require('../controllers/api/tweetController')

/* authenticated */
const authenticated = passport.authenticate('jwt', { session: false })
const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req)) {
    if (helpers.getUser(req).role === 'admin') {
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
router.get('/tweets/', tweetController.getTweets)
router.post('/tweets/', tweetController.postTweet)
router.get('/tweets/:id', authenticated, tweetController.getTweets)

module.exports = router
