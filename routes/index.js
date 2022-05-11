const express = require('express')
const router = express.Router()

const passport = require('../config/passport')

const userController = require('../controllers/user-controller')

router.post('/api/login', passport.authenticate('local', { session: false }), userController.login)

module.exports = router
