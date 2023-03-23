const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const admin = require('./modules/admin')
const user = require('./modules/user')
const adminController = require('../controllers/admin-controller')
const userController = require('../controllers/user-controller')
const { authenticated, authenticatedAdmin, authenticatedUser } = require('../middleware/auth')
const { apiErrorHandler } = require('../middleware/error-handler')

router.post('/admin/signin', passport.authenticate('local', { session: false }), authenticatedAdmin, adminController.signIn)
router.use('/admin', authenticated, admin)
router.post('/users/signin', passport.authenticate('local', { session: false }), authenticatedUser, userController.postSignIn)
router.use('/users', authenticated, user)
router.use(apiErrorHandler)
module.exports = router
