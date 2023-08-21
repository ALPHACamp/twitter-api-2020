const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const userController = require('../controllers/user-controller')
const adminController = require('../controllers/admin-controller')
<<<<<<< HEAD
const { authenticated, authenticatedAdmin, authenticatedUser} = require('../middleware/auth')
=======
const tweetController = require('../controllers/tweet-controller')
>>>>>>> 625ef042457af15dd198ebbb6a45ffed0acf6b0f
const { apiErrorHandler } = require('../middleware/error-handler')

router.post('/api/admin/login', adminController.signIn)
router.use('/api/admin', authenticated, authenticatedAdmin, admin)
router.post('/api/users/login', userController.signIn)

// 推文
router.post('/api/tweets', tweetController.postTweet)
router.get('/api/tweets/:id', tweetController.getTweet)
router.get('/api/tweets', tweetController.getTweets)


router.use('/', apiErrorHandler)

module.exports = router