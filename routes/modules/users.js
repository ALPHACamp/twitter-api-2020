'use strict'

const express = require('express')
const router = express.Router()

const passport = require('../../config/passport')
const userController = require('../../controllers/userController')
const { signInValidator, signUpValidator } = require('../../middleware/validator')
const { isUser } = require('../../middleware/role-check')

// signup & signin
router.post('/signin', signInValidator, passport.authenticate('local', { session: false }), isUser, userController.signIn)
router.post('/', signUpValidator, userController.signUp)

module.exports = router
