const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')
const users = require('./modules/users')

const passport = require('../../config/passport')
const userController = require('../../controllers/user-controller')

const { authenticate, authenticateAdmin } = require('../../middleware/api-auth')
const { apiErrorHandler } = require('../../middleware/error-handler')

router.post('/users/signIn', passport.authenticate('local', { session: false }), userController.signIn)
router.post('/users', userController.signUp)

router.use('/admin', authenticate, authenticateAdmin, admin)
router.use('/users', authenticate, users)

router.use('/', apiErrorHandler)

module.exports = router
