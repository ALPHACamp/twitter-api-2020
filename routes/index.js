const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')
const users = require('./modules/users')
const tweets = require('./modules/tweets')
const followships = require('./modules/followships')
const { authenticated, authUser } = require('../middleware/auth')
const { errorHandler } = require('../middleware/error-handler')

router.use('/api/admin', admin)
router.use('/api/users', users)
router.use('/api/tweets', authenticated, tweets)
router.use('/api/followships', authenticated, authUser, followships)

router.use('/', errorHandler)

module.exports = router
