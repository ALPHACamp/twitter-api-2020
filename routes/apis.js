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
const adminController = require('../controllers/api/adminController')
const replyController = require('../controllers/api/replyController')
const likeController = require('../controllers/api/likeController')
const followshipController = require('../controllers/api/followshipController')


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
router.get('/users/:id/tweets', authenticated, userController.getTweets)
router.get('/users/top', authenticated, userController.getTop)
router.get('/users/:id', authenticated, userController.getUser)
router.post('/users/signin', userController.signIn)
router.post('/users', userController.signUp)
router.get('/users/:id/followings', authenticated, userController.getFollowings)
router.get('/users/:id/followers', authenticated, userController.getFollowers)
router.get('/users/:id/likes', authenticated, userController.getLikes)

// lookup user replied_tweets
router.get(
  '/users/:id/replied_tweets',
  authenticated,
  userController.getReplies
)

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
router.get('/tweets', authenticated, tweetController.getTweets)
router.post('/tweets', authenticated, tweetController.postTweet)
router.get('/tweets/:id', authenticated, tweetController.getTweet)

// **reply**
router.get('/tweets/:id/replies', authenticated, replyController.getReplies)
router.post('/tweets/:id/replies', authenticated, replyController.postReply)

// **like**
router.post('/tweets/:id/like', authenticated, likeController.like)
router.post('/tweets/:id/unlike', authenticated, likeController.unlike)

// **followship**
router.post('/followships', authenticated, followshipController.follow)
router.delete('/followships/:id', authenticated, followshipController.unFollow)

// **admin**
router.post('/admin/signin', authenticated, authenticatedAdmin, adminController.signIn)
router.get('/admin/users', authenticated, authenticatedAdmin, adminController.getUsers)
router.get('/admin/tweets', authenticated, authenticatedAdmin, adminController.getTweets)
router.delete('/admin/tweets/:id', authenticated, authenticatedAdmin, adminController.getTweet)

module.exports = router
