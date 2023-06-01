const express = require('express')
const router = express.Router()
const user = require('./modules/user')
const { apiErrorHandler } = require('../middleware/error-handler')

router.use('/users', user)
router.use('/', apiErrorHandler)
module.exports = router
