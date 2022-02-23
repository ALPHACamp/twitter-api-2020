const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const user = require('./modules/user')
const { generalErrorHandler } = require('../middleware/error-handler')


router.use('/api/admin', admin)
router.use('/api/users', user)
router.use('/api/signin')

router.use('/', generalErrorHandler)


module.exports = router