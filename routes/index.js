const express = require('express')
const router = express.Router()

const passport = require('../config/passport')

const admin = require('./modules/admin')
const userController = require('../controllers/user-controller')
const adminController = require('../controllers/admin-controller')

const { authenticated, authenticatedAdmin } = require('../middleware/api-auth')
const { apiErrorHandler } = require('../middleware/error-handler')

router.use('/admin', authenticatedAdmin, admin)

router.use('/', apiErrorHandler)

module.exports = router
