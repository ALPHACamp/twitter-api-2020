const express = require('express')
const router = express.Router()
const { apiErrorHandler } = require('../../middleware/error-handler')
const user = require('./modules/user')

router.use('/users', user)
router.use('/', apiErrorHandler)

module.exports = router
