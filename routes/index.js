const express = require('express')
const passport = require('../config/passport')
const { apiErrorHandler } = require('../middleware/error-handler')
const router = express.Router()
const admin = require('./modules/admin')
const userController = require('../controllers/user-controller')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')

router.use('/admin', authenticated, authenticatedAdmin, admin)
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.use('/', apiErrorHandler)

module.exports = router
