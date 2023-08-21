const express = require('express')
const router = express.Router()

const tweets = require('./modules/tweets')

const { apiErrorHandler } = require('../middleware/error-handler')

router.use('/api/tweets', tweets)

router.use('/', apiErrorHandler)

module.exports = router
