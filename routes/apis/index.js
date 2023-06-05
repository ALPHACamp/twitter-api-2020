const express = require('express')
const router = express.Router()
const { apiErrorHandler } = require('../../middleware/error-handler')

router.use('/', apiErrorHandler)

module.exports = router
