const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const { generalErrorHandler } = require('../helpers/error-handler')
const { authenticated, checkRoleInverse } = require('../helpers/auth')

const users = require('./modules/users')
const admin = require('./modules/admin')

router.use('/admin', authenticated, checkRoleInverse('user'), admin)

router.use('/users', users)

// fallback route for 404 not found (temporary)
router.get('/', (req, res) => res.send('Hello World!'))

// General error
router.use('/', generalErrorHandler)

module.exports = router
