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

/* authentication */
const { authenticated, authenticatedAdmin } = require('../middleware/auth')

// * upload image *
const uploadImage = upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'cover', maxCount: 1 }
])

/* front desk */

// **users**
router.post('/users/signin', userController.signIn)
router.get('/users/:id/tweets', authenticated, userController.getUserTweets)
router.get('/users/top', authenticated, userController.getTop)
router.get('/users/:id', authenticated, userController.getUser)
router.get('/users/:id/followings', authenticated, userController.getFollowings)
router.get('/users/:id/followers', authenticated, userController.getFollowers)
router.get('/users/:id/likes', authenticated, userController.getLikes)
router.get(
  '/users/:id/replied_tweets',
  authenticated,
  userController.getReplies
)
router.put('/users/:id', authenticated, uploadImage, userController.putUser)
router.put('/users/:id/setting', authenticated, userController.putUserSetting)
router.post('/users', userController.signUp)

// **tweet**
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
router.post('/admin/signin', adminController.signIn)
router.get(
  '/admin/users',
  authenticated,
  authenticatedAdmin,
  adminController.getAdminUsers
)
router.get(
  '/admin/tweets',
  authenticated,
  authenticatedAdmin,
  adminController.getAdminTweets
)
router.delete(
  '/admin/tweets/:id',
  authenticated,
  authenticatedAdmin,
  adminController.deleteTweet
)

module.exports = router
