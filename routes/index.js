// require needed modules
const express = require('express')
const router = express.Router()
// require routes modules
const admin = require('./modules/admin')
const users = require('./modules/users')
const tweets = require('./modules/tweets')
const followships = require('./modules/followships')
const { authenticated, authenticatedAdmin, authenticatedUser } = require('../middleware/api-auth')
const { apiErrorHandler } = require('../middleware/error-handler')
// use router
router.use('/api/admin', admin)
router.use('/api/users', users)
router.use('/api/tweets', authenticated, authenticatedUser, tweets)
router.use('/api/followships', authenticated, authenticatedUser, followships)
router.get('/', (req, res) => res.redirect('/api/tweets'))
router.use('/', apiErrorHandler)

module.exports = router