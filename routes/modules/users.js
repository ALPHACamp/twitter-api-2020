// require needed modules
const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')

// require controller
const userController = require('../../controllers/user-controller')

// set router
router.post('/', userController.register)
router.post('/login', passport.authenticate('local', { session: false }), userController.login)

module.exports = router
