// require needed modules
const express = require('express')
const router = express.Router()
const { apiErrorHandler } = require('../middleware/error-handler')

// require routes modules
const admin = require('./modules/admin')
const users = require('./modules/users')
const tweets = require('./modules/tweets')

// use router
router.use('/api/admin', admin)
router.use('/api/users', users)
router.use('/api/tweets', tweets)
router.get('/', (req, res) => res.redirect('/tweets'))
router.use('/', apiErrorHandler)

module.exports = router
