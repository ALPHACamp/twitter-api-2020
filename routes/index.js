const express = require('express')
const router = express.Router()
const { authenticated, authenticatedAdmin } = require('../middleware/api-auth')

const { apiErrorHandler } = require('../middleware/error-handler')
const users = require('./modules/users')

// signup & login
router.use('/users', authenticated, users)

router.use('/', apiErrorHandler)

const tweets = require('./modules/tweets')

router.use('/tweets', tweets)

module.exports = router
