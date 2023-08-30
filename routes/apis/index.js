const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const upload = require('../../middleware/multer')
const admin = require('./modules/admin')
const userController = require('../../controllers/user-controller')
const tweetController = require('../../controllers/tweet-controller')
const followshipController = require('../../controllers/followship-controller')
const { authenticated, authenticatedAdmin, authenticatedUser } = require('../../middleware/api-auth')
const { apiErrorHandler } = require('../../middleware/error-handler')
const uploadImages = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }])

router.use('/admin/login', passport.authenticate('local', { session: false }), authenticatedAdmin, userController.login)
router.use('/admin', authenticated, authenticatedAdmin, admin)

router.get('/users/current', authenticated, authenticatedUser, userController.getCurrentUser)
router.get('/users/top', authenticated, authenticatedUser, userController.getTopTenUsers)
router.get('/users/current', authenticated, authenticatedUser, userController.getCurrentUser)
router.get('/users/:id/tweets', authenticated, authenticatedUser, userController.getUserTweets)
router.get('/users/:id/replied_tweets', authenticated, authenticatedUser, userController.getUserReplies)
router.get('/users/:id/likes', authenticated, authenticatedUser, userController.getUserLikes)
router.get('/users/:id/followers', authenticated, authenticatedUser, userController.getFollowers)
router.get('/users/:id/followings', authenticated, authenticatedUser, userController.getFollowings)
router.put('/users/:id/account', authenticated, authenticatedUser, userController.putUserAccount)
router.get('/users/:id', authenticated, authenticatedUser, userController.getUser)
router.put('/users/:id', authenticated, authenticatedUser, uploadImages, userController.putUserProfile)
router.post('/users', userController.signUp)
router.post('/login', passport.authenticate('local', { session: false }), authenticatedUser, userController.login)

router.get('/tweets/:tweetId/replies', authenticated, authenticatedUser, tweetController.getTweetReplies)
router.post('/tweets/:tweetId/replies', authenticated, authenticatedUser, tweetController.postTweetReply)
router.post('/tweets/:id/like', authenticated, authenticatedUser, tweetController.postTweetLike)
router.post('/tweets/:id/unlike', authenticated, authenticatedUser, tweetController.postTweetUnlike)
router.get('/tweets/:id', authenticated, authenticatedUser, tweetController.getTweet)
router.post('/tweets', authenticated, authenticatedUser, tweetController.postTweet)
router.get('/tweets', authenticated, authenticatedUser, tweetController.getTweets)

router.post('/followships', authenticated, authenticatedUser, followshipController.addFollowing)
router.delete('/followships/:followingId', authenticated, authenticatedUser, followshipController.removeFollowing)
router.use('/', apiErrorHandler)
module.exports = router
