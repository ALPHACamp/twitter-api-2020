const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')
const adminController = require('../controllers/admin-controller')

const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { apiErrorHandler } = require('../middleware/error-handler')
const { adminSignIn } = require('../middleware/login-handler')

// admin登入
router.post('/admin/signin', adminSignIn, adminController.signIn)
// admin其他路由
router.use('/admin', authenticated, authenticatedAdmin, admin)

router.use('/', apiErrorHandler)

module.exports = router
