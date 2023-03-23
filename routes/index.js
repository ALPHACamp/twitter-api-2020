const express = require('express')
const router = express.Router()

const user = require('./modules/user')
const tweet = require('./modules/tweet')

const { apiErrorHandler } = require('../middleware/error-handler')
const { authenticatedUser } = require('../middleware/auth')

router.use('/users', user)
router.use('/tweets', authenticatedUser, tweet)

router.use('/', apiErrorHandler)

module.exports = router
