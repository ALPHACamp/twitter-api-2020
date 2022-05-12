const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const userController = require('../../controllers/apis/user-controllers')
const { apiErrorHandler, catchAsync } = require('../../middleware/error-handler')

router.post('users', passport.authenticate('local', { session: false }), userController.signIn)
router.post('/signin', catchAsync, userController.signUp)

router.use('/', apiErrorHandler)

module.exports = router
