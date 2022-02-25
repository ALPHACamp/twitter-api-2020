const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

const { apiErrorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedUser, authenticatedAdmin } = require('../middleware/auth')
const { upload } = require('../_helpers')
const uploadImage = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }])

const userController = require('../controllers/user-controller')
const adminController = require('../controllers/admin-controller')

// users
router.post('/api/signin', userController.signIn)
router.post('/api/users', userController.signUp)

router.get('/api/users/:id/replied_tweets', authenticated, authenticatedUser, userController.getReplies)
router.get('/api/users/:id/followings', authenticated, authenticatedUser, userController.getFollowings)
router.get('/api/users/:id/followers', authenticated, authenticatedUser, userController.getFollowers)
router.get('/api/users/:id/likes', authenticated, authenticatedUser, userController.getLikes)
router.get('/api/users/:id/tweets', authenticated, authenticatedUser, userController.getUserTweets)
router.put('/api/users/:id/setting', authenticated, authenticatedUser, userController.putUserSetting)
router.put('/api/users/:id', authenticated, authenticatedUser, uploadImage, userController.putUser)
router.get('/api/users/:id', authenticated, authenticatedUser, userController.getUser)

//admin
router.post('/api/admin/signin', adminController.signIn)
router.get('/api/admin/users', authenticated, authenticatedAdmin, adminController.getAdminUsers)
// router.get('/api/admin/users', authenticated, authenticatedAdmin, adminController.getAdminTweets)
// router.delete('/api/admin/users', authenticated, authenticatedAdmin, adminController.deleteAdminTweet)

router.use('/api', apiErrorHandler)

module.exports = router