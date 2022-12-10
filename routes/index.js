const express = require('express')
const router = express.Router()
const users = require('./modules/users')
const admin = require('./modules/admin')
const errorHandler = require('../middleware/error-handler')

router.use('/admin', admin)
router.use('/users', users)
router.use(errorHandler)

module.exports = router
