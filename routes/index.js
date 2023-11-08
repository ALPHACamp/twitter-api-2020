const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const tweets = require('./modules/tweets')
const upload = require('../middleware/multer')

const { errorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedUser, authenticatedAdmin } = require('../middleware/auth')
const { adminSignin } = require('../middleware/signin-handler')
const userController = require('../controllers/user-controller')
const followshipController = require('../controllers/followship-controller')
const adminController = require('../controllers/admin-controller')

// user signup and signin
router.post('/api/users/signin', userController.signIn)
router.post('/api/users', userController.signUp)
router.put('/api/users/:id', authenticated, authenticatedUser, upload.fields([{ name: 'avatar' }, { name: 'cover' }]), userController.editUser)
router.get('/api/users/top10', authenticated, authenticatedUser, userController.getUserTop10)
router.get('/api/users/:id/tweets', authenticated, authenticatedUser, userController.getUserTweets)
router.get('/api/users/:id/followings', authenticated, authenticatedUser, userController.getUsersFollowings)
router.get('/api/users/:id/followers', authenticated, authenticatedUser, userController.getUsersFollowers)
router.get('/api/users/:id', authenticated, authenticatedUser, userController.getUser)

// followship
router.delete('/api/followships/:id', authenticated, authenticatedUser, followshipController.removeFollowing)
router.post('/api/followships', authenticated, authenticatedUser, followshipController.addFollowing)

// error handler
router.post('/api/admin/signin', adminSignin, adminController.signIn) // admin登入
router.use('/api/admin', authenticated, authenticatedAdmin, admin) // admin其他3支路由
router.use('/api/tweets', authenticated, authenticatedUser, tweets) // tweets相關7支路由
router.use('/', errorHandler)

module.exports = router
