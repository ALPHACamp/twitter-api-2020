const express = require('express')
const router = express.Router()
const { authenticated } = require('../middleware/auth')
const { uploadMultiple } = require('../middleware/multer')
const { errorHandler } = require('../middleware/error-handler')
const userController = require('../controllers/user-controller')
const tweetController = require('../controllers/tweet-controller')
const replyController = require('../controllers/reply-controller')

router.get('/users/:id/tweets', authenticated, userController.getUserTweets)
router.put('/users/:id/account', authenticated, userController.editUserAccount)
router.put('/users/:id', authenticated, uploadMultiple, userController.editUserProfile)
router.get('/users/:id', authenticated, userController.getUser)
router.post('/users', userController.signup)
router.post('/:role/signin', userController.signin)

router.post('/tweets/:tweet_id/replies', authenticated, replyController.postReply)

router.post('/tweets/:id/like', authenticated, tweetController.addTweetLike)
router.post('/tweets/:id/unlike', authenticated, tweetController.removeTweetLike)
router.get('/tweets/:tweet_id', authenticated, tweetController.getTweet)
router.get('/tweets', authenticated, tweetController.getTweets)
router.post('/tweets', authenticated, tweetController.postTweet)

router.use('/', errorHandler) // 錯誤處理
module.exports = router
