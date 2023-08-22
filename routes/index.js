const router = require('express').Router()

const users = require('./modules/users')

const { apiErrorHandler } = require('../middleware/error-handler')

router.use('/users', users)

// error handler
router.use('/', apiErrorHandler)

module.exports = router
