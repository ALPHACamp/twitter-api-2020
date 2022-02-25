const express = require('express')
const passport = require('../../config/passport')
const adminController = require('../../controllers/admin-controller')

const router = express.Router()

router.post('/users/login', passport.authenticate('local', { session: false }), adminController.signIn)

module.exports = router
