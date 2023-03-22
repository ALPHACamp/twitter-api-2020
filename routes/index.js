const express = require('express')
const router = express.Router()
// const passport = require('../config/passport')
const admin = require('./modules/admin')

const { apiErrorHandler } = require('../middleware/error-handler')

router.use('/admin', admin)
router.use('/', apiErrorHandler)
module.exports = router
