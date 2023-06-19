const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const userController = require('../controller/user-controller')
const tweetController = require('../controller/tweet-controller')
const likeController = require('../controller/like-controller')
const adminController = require('../controller/admin-controller')
const followshipController = require('../controller/followship-controller')
const admin = require('./modules/admin')
const { authenticated, authenticatedAdmin, authenticatedUser } = require('../middleware/api-auth')
const { apiErrorHandler } = require('../middleware/error-handler')
const upload = require('../middleware/multer')

// Tweets
router.post('/api/tweets', authenticated, authenticatedUser, tweetController.postTweet)
router.get('/api/tweets', authenticated, authenticatedUser, tweetController.getTweets)
router.get('/api/tweets/:tweet_id', authenticated, authenticatedUser, tweetController.getTweet)
router.get('/api/tweets/:id/likes', authenticated, authenticatedUser, tweetController.getTweetLikes)

// Replies
router.post('/api/tweets/:tweet_id/replies', authenticated, authenticatedUser, tweetController.postReply)
router.get('/api/tweets/:tweet_id/replies', authenticated, authenticatedUser, tweetController.getReplies)
// like
router.post('/api/tweets/:id/like', authenticated, authenticatedUser, likeController.likeTweet)
router.post('/api/tweets/:id/unlike', authenticated, authenticatedUser, likeController.unlikeTweet)
// followship
router.delete('/api/followships/:followingId', authenticated, authenticatedUser, followshipController.removeFollowing)
router.post('/api/followships', authenticated, authenticatedUser, followshipController.addFollowing)
// Users
router.get('/api/users/top10', authenticated, authenticatedUser, userController.getUsersTop10)
router.get('/api/users/:id/tweets', authenticated, authenticatedUser, userController.getUserTweets)
router.get('/api/users/:id/replied_tweets', authenticated, authenticatedUser, userController.getUserReplies)
router.get('/api/users/:id/likes', authenticated, authenticatedUser, userController.getLikedTweets)
router.get('/api/users/:id/followings', authenticated, authenticatedUser, userController.getFollowings)
router.get('/api/users/:id/followers', authenticated, authenticatedUser, userController.getFollowers)
router.put('/api/users/:id/setting', authenticated, authenticatedUser, upload.array(['avatar', 'cover']), userController.putUserSetting)
router.put('/api/users/:id', authenticated, authenticatedUser, userController.putUser)
router.get('/api/users/:id', authenticated, authenticatedUser, userController.getUser)
// 登入& 註冊
router.post('/api/users/login', passport.authenticate('local', { session: false }), userController.signIn)
router.post('/api/users', userController.signUp)
// 後台
router.post('/api/admin/login', passport.authenticate('local', { session: false }), adminController.signIn)
router.get('/api/admin/users', authenticated, authenticatedAdmin, adminController.getUsers)
router.get('/api/admin/tweets', authenticated, authenticatedAdmin, adminController.getTweetList)
router.delete('/api/admin/tweets/:id', authenticated, authenticatedAdmin, adminController.deleteTweet)

router.use('/api/admin', authenticated, authenticatedAdmin, admin)
// 錯誤訊息處理
router.use('/', apiErrorHandler)

module.exports = router
