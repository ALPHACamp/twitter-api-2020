const express = require('express')
const passport = require('../../config/passport')
const router = express.Router()
const userController = require('../../controllers/userController')
const { userRole, authenticated, authenticatedUser } = require('../../middleware/auth')
const { signInValidator, signUpValidator } = require('../../middleware/validator')

router.post('/signin', signInValidator, passport.authenticate('local', { session: false }), userRole, userController.signIn)
router.post('/', signUpValidator, userController.signUp)

router.get('/:id', authenticated, authenticatedUser, userController.getUser)
module.exports = router
