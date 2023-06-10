const express = require('express')
const router = express.Router()

const userController = require('../controllers/user-controller')
const adminController = require('../controllers/admin-controller')
const tweetController = require('../controllers/tweet-controller')
const replyController = require('../controllers/reply-controller')

const cors = require('../middleware/cors')
const upload = require('../middleware/multer')

const { authenticatedAdmin, authenticatedUser, authenticated } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

// signup & signin
router.post('/api/admin/signin', cors, adminController.signIn)
router.post('/api/users/signin', cors, userController.signIn)
router.post('/api/users', cors, userController.signUp)

// user
router.put('/api/users/:id', cors, authenticated, authenticatedUser, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'banner', maxCount: 1 }]), userController.putUser)
router.get('/api/users/:id/tweets', cors, authenticated, authenticatedUser, userController.getUserTweets)
router.get('/api/users/:id/replied_tweets', cors, authenticated, authenticatedUser, userController.getUserRepliedTweets)
router.get('/api/users/:id', cors, authenticated, authenticatedUser, userController.getUser)

// tweet
router.get('/api/tweets/:id', cors, authenticated, authenticatedUser, tweetController.getTweet)
router.get('/api/tweets', cors, authenticated, authenticatedUser, tweetController.getTweets)
router.post('/api/tweets', cors, authenticated, authenticatedUser, tweetController.postTweets)

//like
router.post('/api/tweets/:id/like', cors, authenticated, authenticatedUser, tweetController.addLike)
router.post('/api/tweets/:id/unlike', cors, authenticated, authenticatedUser, tweetController.removeLike)



//reply
router.post('/api/tweets/:id/replies', cors, authenticated, authenticatedUser, replyController.postReplies)
router.get('/api/tweets/:id/replies', cors, authenticated, authenticatedUser, replyController.getReplies)


router.use('/', cors, generalErrorHandler)

module.exports = router