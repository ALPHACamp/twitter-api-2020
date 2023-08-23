const router = require('express').Router()

const users = require('./modules/users')
const admin = require('./modules/admin')
const { apiErrorHandler } = require('../middleware/error-handler')

router.use('/admin', admin)
router.use('/users', users)

// error handler
router.use('/', apiErrorHandler)

module.exports = router
