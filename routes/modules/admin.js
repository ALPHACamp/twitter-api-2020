const express = require('express')
const passport = require('../../config/passport')
const router = express.Router()
const adminController = require('../../controllers/adminController')
const { adminRole } = require('../../middleware/auth')

router.post('/login', passport.authenticate('local', { session: false }), adminRole, adminController.login)
module.exports = router
