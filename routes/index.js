const express = require('express')
const router = express.Router()

const { apiErrorHandler } = require('../middleware/error-handler')
const { authenticatedUser } = require('../middleware/auth')

const user = require('./modules/user')
const tweet = require('./modules/tweet')
const followship = require('./modules/followship')
const admin = require('./modules/admin')

router.use('/users', user)
router.use('/admin', admin)
router.use('/tweets', authenticatedUser, tweet)
router.use('/followships', authenticatedUser, followship)

router.use('/', apiErrorHandler)

module.exports = router
