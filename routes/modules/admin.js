const express = require('express')
const passport = require('../../config/passport')
const adminController = require('../../controllers/admin-controller')
const { authenticatedAdmin } = require('../../middleware/auth')

const router = express.Router()

router.post('/users/login', passport.authenticate('local', { session: false }), adminController.signIn)
router.get('/users', authenticatedAdmin, adminController.getUsers)

module.exports = router
