const express = require('express')
const router = express.Router()

const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { apiErrorHandler } = require('../../middleware/error-handler')
const userController = require('../controllers/user-controller')
const { userSignIn } = require('../middleware/login-handler')

router.post('/users/signin', userSignIn, userController.signIn)

router.use('/', apiErrorHandler)
module.exports = router
