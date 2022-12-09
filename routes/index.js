const express = require('express')
const router = express.Router()
const users = require('./modules/users')
const errorHandler = require('../middleware/error-handler')

router.use('/users', users)

router.use(errorHandler)

module.exports = router
