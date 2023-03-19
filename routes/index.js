const express = require('express')
const router = express.Router()
const tweet = require('./modules/tweet')
const { apiErrorHandler } = require('../middleware/error-handler')

router.use('/tweets', tweet)
router.use('/', apiErrorHandler)
module.exports = router
