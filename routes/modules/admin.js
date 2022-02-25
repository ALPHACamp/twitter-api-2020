const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const { authenticated, authenticatedAdmin } = require('../../middleware/auth')
const adminController = require('../../controllers/admin-controller')

router.post('/signin', passport.authenticate('local', { session: false }), authenticatedAdmin, adminController.signIn)
router.get('/users', authenticated, adminController.getUsers)

module.exports = router