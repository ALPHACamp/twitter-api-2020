const express = require('express')
const router = express.Router()
const passport = require('passport')

const userController = require('../../controllers/userController')

router.post('/users', userController.signUp)
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)

module.exports = router
