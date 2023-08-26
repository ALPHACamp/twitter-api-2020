const express = require('express')
const router = express.Router()
// const storage = multer.memoryStorage()
const upload = require('../middleware/multer')

const admin = require('./modules/admin')

const userController = require('../controllers/apis/user-controller')
const tweetController = require('../controllers/apis/tweet-controller')
const followshipController = require('../controllers/apis/followship-controller')

const { apiErrorHandler } = require('../middleware/error-handler')
const {
  authenticated,
  authenticatedAdmin,
  authenticatedUser
} = require('../middleware/api-auth')

// api/admin
router.use('/api/admin', authenticated, authenticatedAdmin, admin)

// api/users
router.post('/api/users', userController.signUp)
router.post('/api/users/signin', userController.signIn)
router.put('/api/users/:id', authenticated, authenticatedUser, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), userController.updateUser)
router.get('/api/users/:id/likes', authenticated, authenticatedUser, userController.getUserLikes)
router.get('/api/users/:id/tweets', authenticated, authenticatedUser, userController.getUserTweets)
router.get('/api/users/:id/replied_tweets', authenticated, authenticatedUser, userController.getUserReplies)
router.get('/api/users/:id', authenticated, authenticatedUser, userController.getUser)

// api/tweets
router.get(
  '/api/tweets/:tweet_id/replies',
  authenticated,
  authenticatedUser,
  tweetController.getReplies
)
router.post(
  '/api/tweets/:tweet_id/replies',
  authenticated,
  authenticatedUser,
  tweetController.createReply
)
router.get(
  '/api/tweets/:tweet_id/likes',
  authenticated,
  authenticatedUser,
  tweetController.getLikes
)
router.post(
  '/api/tweets/:tweet_id/like',
  authenticated,
  authenticatedUser,
  tweetController.likeTweet
)
router.post(
  '/api/tweets/:tweet_id/unlike',
  authenticated,
  authenticatedUser,
  tweetController.unlikeTweet
)
router.get(
  '/api/tweets/:tweet_id',
  authenticated,
  authenticatedUser,
  tweetController.getTweet
)
router.post(
  '/api/tweets',
  authenticated,
  authenticatedUser,
  tweetController.createTweet
)
router.get(
  '/api/tweets',
  authenticated,
  authenticatedUser,
  tweetController.getTweets
)

// api/followship
router.delete(
  '/api/followships/:following_id',
  authenticated,
  authenticatedUser,
  followshipController.unfollowUser
)
router.get(
  '/api/followships/top10',
  authenticated,
  authenticatedUser,
  followshipController.getTop10
)
router.post(
  '/api/followships',
  authenticated,
  authenticatedUser,
  followshipController.followUser
)
router.use('/', apiErrorHandler)

module.exports = router
