const express = require('express')
const router = express.Router()
const { apiErrorHandler } = require('../../middleware/error-handler')

// import modules
const admin = require('./modules/admin')
const followships = require('./modules/followships')
const likes = require('./modules/likes')
const tweets = require('./modules/tweets')
const users = require('./modules/users')

// use modules
router.use('/admin', admin)
router.use('/followships', followships)
router.use('/likes', likes)
router.use('/tweets', tweets)
router.use('/users', users)

// Error Handler
router.use('/', apiErrorHandler)

module.exports = router
