const express = require('express')
const router = express.Router()
const { authenticatedAdmin, adminPassValid } = require('../middleware/api-auth')
const tweets = require('./modules/tweets')
const { apiErrorHandler } = require('../middleware/error-handler')
const users = require('./modules/users')

router.use('/users', users)

router.use('/tweets', tweets)

router.use('/', apiErrorHandler)
module.exports = router
