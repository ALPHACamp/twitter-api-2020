const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')

const { errorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { adminSignin } = require('../middleware/signin-handler')
const userController = require('../controllers/user-controller')
const followshipController = require('../controllers/followship-controller')
const adminController = require('../controllers/admin-controller')

// user signup and signin
router.post('/api/users/signin', userController.signIn)
router.post('/api/users', userController.signUp)

router.get('/api/users/:id', authenticated, userController.getUser)

// followship
router.delete('/api/followship/:id', authenticated, followshipController.removeFollowing)
router.post('/api/followship', authenticated, followshipController.addFollowing)

// error handler
router.post('/api/admin/signin', adminSignin, adminController.signIn) // admin登入
router.use('/api/admin', authenticatedAdmin, admin) // admin其他3支路由
router.use('/', errorHandler)

module.exports = router
