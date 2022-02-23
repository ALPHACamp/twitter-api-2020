const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

const { apiErrorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedUser, authenticatedAdmin } = require('../middleware/auth')

const userController = require('../controllers/user-controller')

router.post('/api/signin', userController.signIn)
router.post('/api/users', userController.signUp)

router.use('/', apiErrorHandler)

module.exports = router