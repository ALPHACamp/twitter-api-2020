const express = require('express')
const router = express.Router()

const adminController = require('../controllers/admin-controller')

const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { apiErrorHandler } = require('../middleware/error-handler')
const { adminSignIn } = require('../middleware/login-handler')

// admin登入
router.post('/admin/signin', adminSignIn, adminController.signIn)

router.use('/', apiErrorHandler)

module.exports = router
