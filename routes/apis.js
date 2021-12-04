/* necessary */
const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const helpers = require('../_helpers')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

/* Controller */
const userController = require('../controllers/api/userController')
const tweetController = require('../controllers/api/tweetController')
const adminController = require('../controllers/api/adminController.js')

/* authenticated */
const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return next(err)
    }
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'without jwt' })
    }
    req.user = user
    return next()
  })(req, res, next)
}

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

/* front desk */

// **users**
// signin
router.post('/users/signin', userController.signIn)
// signUp
router.post('/users', userController.signUp)
// lookup user Tweets
router.get('/users/:id/tweets', authenticated, userController.getTweets)
// lookup user information
router.get('/users/:id', authenticated, userController.getUser)
// edit personal data
router.put(
  '/users/:id',
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'cover', maxCount: 1 }
  ]),
  authenticated,
  userController.putUsers
)

// **tweet**
// tweet
router.get('/tweets/', authenticated, tweetController.getTweets)
router.post('/tweets/', authenticated, tweetController.postTweet)
router.get('/tweets/:id', authenticated, tweetController.getTweet)

// **admin**
// signin
router.post('/admin/signin', adminController.signIn) //signin

module.exports = router
