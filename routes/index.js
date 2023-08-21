const router = require('express').Router()

const { apiErrorHandler } = require('../middleware/error-handler')

// error handler
router.use('/', apiErrorHandler)

module.exports = router