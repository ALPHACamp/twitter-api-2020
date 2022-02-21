const express = require('express')
const router = express.Router()
const { generalErrorHandler } = require('../helpers/error-handler')
const { authenticated, authenticatedAdmin } = require('../helpers/auth')

const users = require('./modules/users')
const tweets = require('./modules/tweets')

router.use('/users', users)
router.use('/tweets', authenticated, tweets)

// fallback route for 404 not found (temporary)
router.get('/', (req, res) => res.send('Hello World!'))

// General error
router.use('/', generalErrorHandler)

module.exports = router
