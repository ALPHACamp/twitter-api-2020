const express = require('express')
const router = express.Router()
const upload = require('../../middleware/multer')
const admin = require('./modules/admin')
const adminController = require('../../controllers/admin-controller')
const userController = require('../../controllers/user-controller')
// const tweetController = require('../../controllers/tweet-controller')
const { apiErrorHandler } = require('../../middleware/error-handler')
const { authenticated, authenticatedAdmin, authenticatedLocal } = require('../../middleware/api-auth')

// 後台
// Admin: sign in/ logout
router.post('/admin/signin', authenticatedLocal, authenticatedAdmin, adminController.signIn)
router.use('/admin', authenticated, authenticatedAdmin, admin)

// 前台
// Users
router.post('/users', userController.signUp)
router.post('/signin', authenticatedLocal, userController.signIn)

router.get('/users/:id', authenticated, userController.getUser)
router.put('/users/:id', authenticated, userController.putUser)
router.get('/users/:id/tweets', authenticated, upload.single('image'), userController.getTweets)
// Tweets
// router.get('/tweets', authenticated, tweetController.getTweets)

// error handler
router.use('/', apiErrorHandler)
module.exports = router
