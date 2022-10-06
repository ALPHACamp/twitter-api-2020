const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const adminController = require('../../controllers/admin-controller')
const userController = require('../../controllers/user-controller')
// const tweetController = require('../../controllers/tweet-controller')
const { apiErrorHandler } = require('../../middleware/error-handler')
const { authenticated, authenticatedAdmin, authenticatedLocal } = require('../../middleware/api-auth')

// 後台
// Admin: sign in/ logout
router.use('/api/admin', authenticated, authenticatedAdmin, admin)
router.post('/api/admin/signin', authenticated, authenticatedAdmin, adminController.signIn)

// 前台
// Users
router.post('/api/users', userController.signUp)
router.post('/api/signin', authenticatedLocal, userController.signIn)
router.get('/api/users/:id/tweets', authenticated, userController.getTweets)
// Tweets
// router.get('/tweets', authenticated, tweetController.getTweets)

// error handler
router.use('/', apiErrorHandler)
module.exports = router
