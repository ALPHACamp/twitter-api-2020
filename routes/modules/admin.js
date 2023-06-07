const express = require('express')
const passport = require('../../config/passport')
const router = express.Router()
const adminController = require('../../controllers/adminController')
const { adminRole, authenticated, authenticatedAdmin } = require('../../middleware/auth')
const { signInValidator } = require('../../middleware/validator')

router.post('/login', signInValidator, passport.authenticate('local', { session: false }), adminRole, adminController.login)
router.get('/users', authenticated, authenticatedAdmin, adminController.getUsers)
module.exports = router
