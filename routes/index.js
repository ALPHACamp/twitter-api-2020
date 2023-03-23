const express = require('express')
const router = express.Router()
// const passport = require('../config/passport')
const admin = require('./modules/admin')
const user = require('./modules/user')

const { apiErrorHandler } = require('../middleware/error-handler')

router.use('/admin', authenticated, authenticatedAdmin, admin)
router.use('/user', authenticated, authenticatedUser, user)
router.use('/', apiErrorHandler)
module.exports = router
