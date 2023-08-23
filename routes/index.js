const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const userController = require('../controllers/user-controller')
const adminController = require('../controllers/admin-controller')
const { authenticated, authenticatedAdmin, authenticatedUser } = require('../middleware/auth')
const tweetController = require('../controllers/tweet-controller')
const replyController = require('../controllers/reply-controller')
const followshipController = require('../controllers/followship-controller')
const { apiErrorHandler } = require('../middleware/error-handler')

router.post('/api/admin/login', adminController.signIn)
router.use('/api/admin', authenticated, authenticatedAdmin, admin)
router.post('/api/users/login', userController.signIn)

//user
router.get('/api/users/:id', authenticated, authenticatedUser, userController.getUser)

// 推文
router.post('/api/tweets', tweetController.postTweet)
router.get('/api/tweets/:id', tweetController.getTweet)
router.get('/api/tweets', tweetController.getTweets)

// 留言
router.post('/api/tweets/:TweetId/replies', replyController.postReply)
router.get('/api/tweets/:TweetId/replies', replyController.getReplies)

// 追蹤
router.post('/api/followships', authenticated, authenticatedUser, followshipController.addFollowing)
router.delete('/api/followships/:followingId', authenticated, authenticatedUser, followshipController.removeFollowing)

router.use('/', apiErrorHandler)

module.exports = router