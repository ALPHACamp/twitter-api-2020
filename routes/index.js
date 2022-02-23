const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

const { apiErrorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedUser, authenticatedAdmin } = require('../middleware/auth')

const userController = require('../controllers/user-controller')

// users
router.post('/signin', userController.signIn)
router.post('/users', userController.signUp)
router.get('/users/:id', authenticated, authenticatedUser, userController.getUser)

router.use('/', apiErrorHandler)

module.exports = router