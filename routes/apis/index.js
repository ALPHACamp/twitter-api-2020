const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const users = require('./modules/users')
const { authenticated, authenticatedAdmin, authenticatedUser } = require('../../middleware/auth')
const { apiErrorHandler } = require('../../middleware/error-handler')

router.use('/admin', authenticated, authenticatedAdmin, admin)
router.use('/signin', authenticated, users)

router.get('/', (req, res) => res.send('Hello World!'))

router.use('/', apiErrorHandler)
module.exports = router
