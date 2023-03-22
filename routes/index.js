const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const admin = require('./modules/admin')

const { authenticated, authenticatedAdmin, authenticatedUser } = require('../middleware/auth')
const { apiErrorHandler } = require('../middleware/error-handler')

router.use('/admin', authenticated, authenticatedAdmin, admin)
router.use('/', apiErrorHandler)
module.exports = router