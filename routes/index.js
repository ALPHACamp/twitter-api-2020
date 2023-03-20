const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const users = require('./modules/users')
const tweets = require('./modules/tweets')
const followships = require('./modules/followships')



const { authenticated, authenticatedAdmin, authenticatedUser } = require('../../middleware/auth')
const { apiErrorHandler } = require('../../middleware/error-handler')

router.use('/users', users)

router.use('/tweets', authenticated, authenticatedUser, tweets)

router.use('/followships', authenticated, authenticatedUser, followships)

router.use('/admin', authenticated, authenticatedAdmin, admin)

router.use('/', apiErrorHandler)

module.exports = router
