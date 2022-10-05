const express = require('express')
const router = express.Router()

const users = require('./modules/users')
const tweets = require('./modules/tweets')
const followships = require('./modules/followships')

const { authenticated } = require('../../middleware/api-auth')
const { apiErrorHandler } = require('../../middleware/error-handler')

router.use('/users', users)
router.use('/tweets', authenticated, tweets)
router.use('/followships', authenticated, followships)
router.use('/', apiErrorHandler)

module.exports = router
