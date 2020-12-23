const express = require('express')
const router = express.Router()

const authController = require('../controllers/authController')
const { authenticate } = require('../middleware/auth')

router.post('/login', authController.login)
router.post('/users', authController.register)
router.get('/current_user', authenticate, authController.getCurrentUser)

module.exports = router
