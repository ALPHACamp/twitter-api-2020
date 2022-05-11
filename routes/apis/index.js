const express = require('express')
const router = express.Router()
const userController = require('../../controllers/apis/user-controllers')
const { apiErrorHandler, catchAsync } = require('../../middleware/error-handler')

router.post('users', userController.signIn)
router.post('/signin', catchAsync, userController.signUp)

router.use('/', apiErrorHandler)

module.exports = router
