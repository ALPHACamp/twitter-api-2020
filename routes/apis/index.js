const express = require('express')
const router = express.Router()

const passport = require('../../config/passport')
const admin = require('./modules/admin')

router.use('/admin', admin)
router.post('/login', passport.authenticate('local', { session: false }), userController.login)
router.use('/')

module.exports = router