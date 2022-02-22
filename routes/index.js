const express = require('express')
const router = express.Router()
const { generalErrorHandler } = require('../helpers/error-handler')
const { authenticated, blockRole } = require('../helpers/auth')

const users = require('./modules/users')
const tweets = require('./modules/tweets')
const admin = require('./modules/admin')
const followships = require('./modules/followships')


router.use('/admin', authenticated, blockRole('user'), admin)
router.use('/users', users)
router.use('/tweets', authenticated, blockRole('admin'), tweets)
router.use('/followships', authenticated, blockRole('admin'), followships)

// fallback route for 404 not found (temporary)
router.get('/', (req, res) => res.send('Hello World!'))

// General error
router.use('/', generalErrorHandler)

module.exports = router
