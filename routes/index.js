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

// Tweets
router.post('/api/tweets', authenticatedUser, tweetController.createTweet)
router.get('/api/tweets', tweetController.getTweets)
router.get('/api/tweets/:tweet_id', tweetController.getTweet)

// Replies
router.post('/api/tweets/:tweet_id/replies', authenticated, tweetController.postReply)
router.get('/api/tweets/:tweet_id/replies', authenticated, tweetController.getReplies)
// like
router.post('/api/tweets/:id/like', authenticated, likeController.likeTweet)
router.post('/api/tweets/:id/unlike', authenticated, likeController.unlikeTweet)
// followship
router.post('/api/followships', authenticated, followshipController.addFollowing)
router.delete('/api/followships/:followingId', authenticated, followshipController.removeFollowing)
// Users
router.get('/api/users/:id/tweets', authenticated, userController.getUserTweets)
router.get('/api/users/:id/replied_tweets', authenticated, userController.getUserReplies)
router.get('/api/users/:id/likes', authenticated, userController.getLikedTweets)
router.get('/api/users/:id/followings', authenticated, userController.getFollowings)
router.get('/api/users/:id/followers', authenticated, userController.getFollowers)
router.put('/api/users/:id/setting', authenticated, userController.putUserSetting)
router.put('/api/users/:id', authenticated, userController.putUser)
router.get('/api/users/:id', authenticated, userController.getUser)
// 登入& 註冊
router.post('/api/users/login', passport.authenticate('local', { session: false }), userController.signIn)
router.post('/api/users', userController.signUp)
// 後台
router.post('/api/admin/login', passport.authenticate('local', { session: false }), adminController.signIn)
router.get('/api/admin/users', authenticated, authenticatedAdmin, adminController.getUsers)
router.delete('/api/admin/tweets/:id', authenticated, authenticatedAdmin, adminController.deleteTweet)

router.use('/api/admin', authenticated, authenticatedAdmin, admin)
// 錯誤訊息處理
router.use('/', apiErrorHandler)

module.exports = router
