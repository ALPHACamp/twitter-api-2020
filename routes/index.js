const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const admin = require('./modules/admin')
const adminController = require('../controllers/admin-controller')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { apiErrorHandler } = require('../middleware/error-handler')

router.post('/admin/signin', passport.authenticate('local', { session: false }), authenticatedAdmin, adminController.signIn)
router.use('/admin', authenticated, admin)
router.use('/', apiErrorHandler)
module.exports = router
