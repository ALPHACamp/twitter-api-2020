const express = require('express')
const router = express.Router()

const adminController = require('../controllers/admin-controller')
const userController = require('../controllers/user-controller')

const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { apiErrorHandler } = require('../middleware/error-handler')
const { adminSignIn, userSignIn } = require('../middleware/login-handler')

// user登入
router.post('/users/signin', userSignIn, userController.signIn)
// admin登入
router.post('/admin/signin', adminSignIn, adminController.signIn)

router.use('/', apiErrorHandler)

module.exports = router
