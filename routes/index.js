const express = require('express')
const router = express.Router()

//packages
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

// controllers
const userController = require('../controllers/userController')
const tweetController = require('../controllers/tweetController')
const likeController = require('../controllers/likeController')
const replyController = require('../controllers/replyController')
const followshipController = require('../controllers/followshipController')

// authorizers
const { authToken, authUserRole, authAdminRole } = require('../middleware/auth')

// routes
// tweet
router.post('/api/tweets', authToken, authUserRole, tweetController.createTweet)
router.get('/api/tweets', authToken, authUserRole, tweetController.getTweets)
router.get('/api/tweets/:id', authToken, authUserRole, tweetController.getTweet)
router.put('/api/tweets/:id', authToken, authUserRole, tweetController.updateTweet)
router.delete('/api/tweets/:id', authToken, authUserRole, tweetController.deleteTweet)

// like
router.post('/api/tweets/:id/like', authToken, authUserRole, likeController.createLike)
router.post('/api/tweets/:id/unlike', authToken, authUserRole, likeController.deleteLike)

//followship
router.post('/api/followships', authToken, authUserRole, followshipController.createFollowship)
router.delete('/api/followships/:id', authToken, authUserRole, followshipController.deleteFollowship)

// reply
router.post('/api/tweets/:id/replies', authToken, authUserRole, replyController.createReply)
router.get('/api/tweets/:id/replies', authToken, authUserRole, replyController.getReplies)
router.get('/api/replies/:id', authToken, authUserRole, replyController.getReply)
router.put('/api/replies/:id', authToken, authUserRole, replyController.updateReply)
router.delete('/api/replies/:id', authToken, authUserRole, replyController.deleteReply)

//users
router.post('/api/login', userController.login)
router.post('/api/users', userController.createUser)
router.get('/api/users/top', authToken, authUserRole, userController.getTopUsers)
router.get('/api/users/:id', authToken, authUserRole, userController.getUser)
router.get('/api/users/:id/tweets', authToken, authUserRole, userController.getTweets)
router.put('/api/users/:id', authToken, authUserRole, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), userController.updateUser) //編輯個人資料
router.put('/api/users/:id/setting', authToken, authUserRole, userController.updateUserSetting) //設定
router.get('/api/users/:id/replied_tweets', authToken, authUserRole, userController.getRepliedTweets)

//admin
router.get('/api/admin/users', authToken, authAdminRole, userController.getUsers)

module.exports = router