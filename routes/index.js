const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const userController = require('../controllers/user-controller')
const adminController = require('../controllers/admin-controller')
const tweetController = require('../controllers/tweet-controller')
const replyController = require('../controllers/reply-controller')
const followshipController = require('../controllers/followship-controller')
const { authenticated, authenticatedAdmin, authenticatedUser } = require('../middleware/auth')
const { apiErrorHandler } = require('../middleware/error-handler')
const upload = require('../middleware/multer')

router.post('/api/admin/login', adminController.signIn)
router.use('/api/admin', authenticated, authenticatedAdmin, admin)
router.post('/api/users/login', userController.signIn)

// user
router.get('/api/users/:id/tweets', authenticated, authenticatedUser, userController.getUserTweets)
router.get('/api/users/:id/replied_tweets', authenticated, authenticatedUser, userController.getUserRepliedTweets)
router.get('/api/users/:id/followings', authenticated, authenticatedUser, userController.getUserFollowings)
router.get('/api/users/:id/followers', authenticated, authenticatedUser, userController.getUserFollowers)
router.get('/api/users/:id/likes', authenticated, authenticatedUser, userController.getUserLikedTweets)
router.get('/api/users/:id', authenticated, authenticatedUser, userController.getUser)
router.put('/api/users/:id', upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'banner', maxCount: 1 }]), authenticated, authenticatedUser, userController.putUser)
router.post('/api/users', upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'banner', maxCount: 1 }]), userController.signUp)

// 推文
router.post('/api/tweets', authenticated, authenticatedUser, tweetController.postTweet)
router.get('/api/tweets/:id', authenticated, authenticatedUser, tweetController.getTweet)
router.get('/api/tweets', authenticated, authenticatedUser, tweetController.getTweets)

// 留言
router.post('/api/tweets/:tweet_id/replies', authenticated, authenticatedUser, replyController.postReply)
router.get('/api/tweets/:tweet_id/replies', authenticated, authenticatedUser, replyController.getReplies)

// 讚
router.post('/api/tweets/:id/like', authenticated, authenticatedUser, tweetController.addLike)
router.post('/api/tweets/:id/unlike', authenticated, authenticatedUser, tweetController.removeLike)

// 追蹤
router.post('/api/followships', authenticated, authenticatedUser, followshipController.addFollowing)
router.delete('/api/followships/:followingId', authenticated, authenticatedUser, followshipController.removeFollowing)

router.use('/', apiErrorHandler)

module.exports = router
