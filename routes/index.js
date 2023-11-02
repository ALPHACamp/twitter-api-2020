const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')

const { errorHandler } = require('../middleware/error-handler')
const { adminSignin } = require('../middleware/signin-handler')
const userController = require('../controllers/user-controller')
const adminController = require('../controllers/admin-controller')

const { authenticated, authenticatedAdmin } = require('../middleware/auth')

// user signup and signin
router.post('/api/users/signin', userController.signIn)
router.post('/api/users', userController.signUp)

router.post('/api/admin/signin', adminSignin, adminController.signIn) // admin登入
router.use('/api/admin', authenticated, authenticatedAdmin, admin) // admin其他3支路由
router.use('/', errorHandler)

module.exports = router
