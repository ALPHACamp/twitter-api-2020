const express = require('express')
const router = express.Router()
const passport = require('passport')

const userController = require('../../controllers/userController')
const { signInFail } = require('../../middleware/error-handler')

router.post('/users', userController.signUp)
router.post('/signin', passport.authenticate('local', { session: false, failWithError: true }), userController.signIn, signInFail)

module.exports = router
