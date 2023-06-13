const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const { multiUpload } = require('../middleware/multer')
const { apiErrorHandler } = require('../middleware/error-handler')
// import controllers
const userController = require('../controllers/user-controller')
const tweetController = require('../controllers/tweet-controller')
const replyController = require('../controllers/reply-controller')
const likeController = require('../controllers/like-controller')
const followshipController = require('../controllers/followship-controller')
// import auth
const { authenticated, authenticatedUser } = require('../middleware/api-auth')

// admin
router.use('/api/admin', admin)

// user
router.post('/api/users/signin', userController.signIn)
router.post('/api/users', userController.signUp)
router.get('/api/user', authenticated, authenticatedUser, userController.getCurrentUser)

// user profile
router.get('/api/users/:id', authenticated, authenticatedUser, userController.getUserProfile)
router.put('/api/users/:id/profile', authenticated, authenticatedUser, multiUpload, userController.putUserProfile)

// user data
router.get('/api/users/:id/tweets', authenticated, authenticatedUser, userController.getUserTweets)
router.get('/api/users/:id/replied_tweets', authenticated, authenticatedUser, userController.getUserRepliedTweets)
router.get('/api/users/:id/likes', authenticated, authenticatedUser, userController.getUserLikes)
router.get('/api/users/:id/followings', authenticated, authenticatedUser, userController.getFollowings)
router.get('/api/users/:id/followers', authenticated, authenticatedUser, userController.getFollowers)

// tweets
router.get('/api/tweets/:tweet_id', authenticated, authenticatedUser, tweetController.getTweet)
router.get('/api/tweets', authenticated, authenticatedUser, tweetController.getTweets)
router.post('/api/tweets', authenticated, authenticatedUser, tweetController.postTweets)

// replies
router.get('/api/tweets/:tweet_id/replies', authenticated, authenticatedUser, replyController.getTweetReply)
router.post('/api/tweets/:tweet_id/replies', authenticated, authenticatedUser, replyController.postTweetReply)

// likes
router.post('/api/tweets/:id/like', authenticated, authenticatedUser, likeController.postTweetLike)
router.post('/api/tweets/:id/unlike', authenticated, authenticatedUser, likeController.postTweetUnlike)

// followships
router.delete('/api/followships/:followingId', authenticated, authenticatedUser, followshipController.removeFollowship)
router.post('/api/followships', authenticated, authenticatedUser, followshipController.addFollowship)
router.get('/api/followships', authenticated, authenticatedUser, followshipController.getTop10Followers)
// error handler
router.use('/', apiErrorHandler)

module.exports = router
