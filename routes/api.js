const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const helpers = require('../_helpers')
const userController = require('../controllers/api/userControllers')
const tweetController = require('../controllers/api/tweetControllers')


const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) { return next(err) }
    if (!user) {
      return res.status(401).json({ status: 'error', message: "permission denied!!" })
    }
    req.user = user
    return next()
  })(req, res, next)
}


const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req)) {
    if (helpers.getUser(req) === 'admin') { return next() }
    return res.status(401).json({ status: 'error', message: 'permission denied' })
  } else {
    return res.status(401).json({ status: 'error', message: 'permission denied' })
  }
}



//user
router.get('/users/:id/tweets', userController.getUserTweets)
router.get('/users/:id/replied_tweets', userController.getReplyTweet)
router.get('/users/:id', authenticated, userController.getUser)
router.post('/signin', userController.signIn)
router.post('/users', userController.signUp)


//tweet
router.get('/tweets/:id', authenticated, tweetController.getTweet)
router.get('/tweets', authenticated, tweetController.getTweets)
router.post('/tweets', authenticated, tweetController.postTweets)



module.exports = router