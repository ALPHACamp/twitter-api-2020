const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')
const users = require('./modules/users')

const { authenticated, authenticatedAdmin } = require('../middleware/api-auth')
const { apiErrorHandler } = require('../middleware/error-handler')

router.use('/admin', authenticated, authenticatedAdmin, admin)
router.use('/users', authenticated, users)

router.use('/', apiErrorHandler)

module.exports = router
