const router = require('express').Router()

const users = require('./modules/users')
const admin = require('./modules/admin')
const followship = require('./modules/followship')
const { apiErrorHandler } = require('../middleware/error-handler')

router.use('/admin', admin)
router.use('/users', users)
router.use('/followships', followship)

// error handler
router.use('/', apiErrorHandler)

module.exports = router
