const express = require('express')
const router = express.Router()

const authController = require('../../controllers/auth-controller')
const { authenticated, isUser, isAdmin, authenticatedUser, authenticatedAdmin } = require('../../middleware/auth')

router.get('/user', authenticated, authController.authToken)
router.get('/admin', authenticated, authController.authToken)

module.exports = router
