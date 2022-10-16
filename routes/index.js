const express = require('express')
const router = express.Router()
const { authenticated } = require('../middleware/auth')
const { apiErrorHandler } = require('../middleware/error-handler')
const admin = require('./modules/admin')
const tweets = require('./modules/tweets')
const user = require('./modules/user')
const followship = require('./modules/followship')

router.use('/api/admin', admin)
router.use('/api/tweets', authenticated, tweets)
router.use('/api/users', user)
router.use('/api/followships', followship)
router.use('/', apiErrorHandler)

module.exports = router
