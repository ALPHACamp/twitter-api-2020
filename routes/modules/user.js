const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')

const userController = require('../../controllers/user-controller')

router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.post('/', userController.signUp)

module.exports = router