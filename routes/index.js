const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const userController = require('../controllers/user-controller')
const adminController = require('../controllers/admin-controller')
const { authenticated, authenticatedAdmin, authenticatedUser } = require('../middleware/auth')
const tweetController = require('../controllers/tweet-controller')
const replyController = require('../controllers/reply-controller')
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
router.post('/api/tweets/:tweet_id/replies', authenticated, authenticatedUser, replyController.postReply)
router.get('/api/tweets/:tweet_id/replies', authenticated, authenticatedUser, replyController.getReplies)

router.use('/', apiErrorHandler)

module.exports = router