const express = require('express')
const router = express.Router()
const { authenticated, authenticatedAdmin } = require('../middleware/api-auth')

const { apiErrorHandler } = require('../middleware/error-handler')
const users = require('./modules/users')
const tweets = require('./modules/tweets')
const admin = require('./modules/admin')
const followships = require('./modules/followships')

// signup & login
router.use('/users', authenticated, users)

router.use('/admin', authenticated, authenticatedAdmin, admin)
router.use('/tweets', authenticated, tweets)
router.use('/followships', authenticated, followships)

router.use('/', apiErrorHandler)

module.exports = router
