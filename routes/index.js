const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controller')
const tweetController = require('../controllers/tweet-controller')
const replyController = require('../controllers/reply-controller')
const adminController = require('../controllers/admin-controller')
const { apiErrorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedUser, authenticatedAdmin } = require('../middleware/api-auth')


router.get('/', (req, res) => {
  res.send('Hello World!')
})
router.post('/api/tweets/:id/replies', authenticated, replyController.postReply)
router.get('/api/tweets/:id/replies', authenticated, replyController.getReplies)
router.get('/api/tweets/:tweetId', authenticated, tweetController.getTweet)
router.post('/api/tweets', authenticated, tweetController.postTweet)
router.get('/api/tweets', authenticated, tweetController.getTweets)
router.get('/api/users/:id/tweets', authenticated, userController.getUserTweets)
router.post('/api/users', userController.signUp)
router.post('/api/signin', userController.signIn)
router.post('/api/admin/signin', adminController.signIn)
router.get('/api/admin/tweets', authenticated, adminController.getTweets)
router.delete('/api/admin/tweets/:id', authenticated, adminController.deleteTweet)
router.get('/api/admin/users', authenticated, adminController.getUsers)
router.use('/', apiErrorHandler) //放最後一關檢查

module.exports = router