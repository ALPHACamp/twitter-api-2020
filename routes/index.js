const express = require('express')
const passport = require('../config/passport')
const userController = require('../controllers/user-controller')
const router = express.Router()

router.post('/api/login', passport.authenticate('local', { session: false }), userController.login)

module.exports = router
