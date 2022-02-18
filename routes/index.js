const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const { generalErrorHandler } = require('../helpers/error-handler')
const { authenticated, authenticatedAdmin } = require('../helpers/auth')

const users = require('./modules/users')

router.use('/users', users)

// fallback route for 404 not found (temporary)
router.get('/', (req, res) => res.send('Hello World!'))

// General error
router.use('/', generalErrorHandler)

module.exports = router
