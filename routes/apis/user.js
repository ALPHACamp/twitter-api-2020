const express = require('express')
const router = express.Router()
const passport = require('passport')
const { apiErrorHandler } = require('../../middleware/error-handler')
const userController = require('../../controllers/user-controller')

router.post('/', userController.signUp)
router.post('/test-token', userController.userVerify)
router.post('/login', passport.authenticate('local', { session: false, failureMessage: true, failWithError: true }), userController.signIn, userController.signInFail)

router.use('/', apiErrorHandler)
module.exports = router
