const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const userController = require('../controllers/user-controller')
const adminController = require('../controllers/admin-controller')
const { authenticated, authenticatedAdmin, authenticatedUser } = require('../middleware/auth')
const tweetController = require('../controllers/tweet-controller')
const replyController = require('../controllers/reply-controller')
const upload = require('../middleware/multer')
const { apiErrorHandler } = require('../middleware/error-handler')

router.post('/api/admin/login', adminController.signIn)
router.use('/api/admin', authenticated, authenticatedAdmin, admin)
router.post('/api/users/login', userController.signIn)

// user
router.get('/api/users/:id', authenticated, authenticatedUser, userController.getUser)
router.put('/api/users/:id', upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'banner', maxCount: 1 }]), authenticated, authenticatedUser, userController.putUser)
router.get('/api/users/:id/tweets', authenticated, authenticatedUser, userController.getUserTweets)



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

router.use('/', apiErrorHandler)

module.exports = router
