const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const tweets = require('./modules/tweets')
const users = require('./modules/users')

const { errorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedUser, authenticatedAdmin } = require('../middleware/auth')
const { adminSignin } = require('../middleware/signin-handler')
const userController = require('../controllers/user-controller')
const followshipController = require('../controllers/followship-controller')
const adminController = require('../controllers/admin-controller')

// user signup and signin
router.post('/api/users/signin', userController.signIn)
router.post('/api/users', userController.signUp)
router.use('/api/users', authenticated, authenticatedUser, users)

// followship
router.delete('/api/followships/:id', authenticated, authenticatedUser, followshipController.removeFollowing)
router.post('/api/followships', authenticated, authenticatedUser, followshipController.addFollowing)

// error handler
router.post('/api/admin/signin', adminSignin, adminController.signIn) // admin登入
router.use('/api/admin', authenticated, authenticatedAdmin, admin) // admin其他3支路由
router.use('/api/tweets', authenticated, authenticatedUser, tweets) // tweets相關7支路由
router.use('/', errorHandler)

module.exports = router
