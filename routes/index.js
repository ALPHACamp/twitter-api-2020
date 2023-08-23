const router = require('express').Router()

const users = require('./modules/users')
const admin = require('./modules/admin')
const { apiErrorHandler } = require('../middleware/error-handler')
const passport = require('passport')
const adminController = require('../controllers/adminController')
const { isAdmin } = require('../middleware/role-check')

router.post('/admin/login', passport.authenticate('local', { session: false }), isAdmin, adminController.login)
router.use('/admin', admin)

router.use('/users', users)

// error handler
router.use('/', apiErrorHandler)

module.exports = router
