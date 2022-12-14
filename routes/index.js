const express = require('express')
const router = express.Router()
const { authenticated, authenticatedAdmin } = require('../middleware/api-auth')

const { apiErrorHandler } = require('../middleware/error-handler')
const users = require('./modules/users')

// signup & login
router.use('/users', authenticated, users)

router.use('/', apiErrorHandler)

module.exports = router
