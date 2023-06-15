// require needed modules
const express = require('express')
const router = express.Router()
const authController = require('../../controllers/auth-controller')
const { authenticated, authenticatedUser, authenticatedAdmin } = require('../../middleware/api-auth')

router.post('/users', authenticated, authenticatedUser, authController.checkUserToken)
router.post('/admin', authenticated, authenticatedAdmin, authController.checkAdminToken)

module.exports = router
