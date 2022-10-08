const express = require('express')
const router = express.Router()

const users = require('./modules/users')
const admin = require('./modules/admins')
const tweets = require('./modules/tweets')
const followships = require('./modules/followships')

const { authenticated, authenticatedUser } = require('../../middleware/api-auth')
const { apiErrorHandler } = require('../../middleware/error-handler')

router.use('/users', users)
router.use('/admin', admin)
router.use('/tweets', authenticated, authenticatedUser, tweets)
router.use('/followships', authenticated, authenticatedUser, followships)
router.use('/', apiErrorHandler)

module.exports = router
