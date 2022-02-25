const express = require('express')
const router = express.Router()

const { apiErrorHandler } = require('../middleware/error-handler')
const { authenticated } = require('../middleware/auth')
const user = require('./modules/user')
const tweet = require('./modules/tweet')
const followship = require('./modules/followship')

router.use('/users', user)
router.use('/tweets', authenticated, tweet)
router.use('/followships', authenticated, followship)
router.use('/', apiErrorHandler)

module.exports = router
