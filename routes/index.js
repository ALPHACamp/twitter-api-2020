const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')
const user = require('./modules/user')
const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedUser, authenticatedAdmin } = require('../middleware/auth')

// admin
router.use('/api/admin', authenticated, authenticatedAdmin, admin)

// user
router.use('/api', authenticated, authenticatedUser, user)

// handle error
router.use('/', generalErrorHandler)

module.exports = router
