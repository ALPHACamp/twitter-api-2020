const express = require('express')

const passport = require('../../../config/passport')
const userController = require('../../../controllers/user-controller')

const router = express.Router()

router.post('/login', passport.authenticate('local', { session: false }), userController.signIn)
router.post('/', userController.signUp)

module.exports = router
