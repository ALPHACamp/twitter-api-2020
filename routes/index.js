const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')
const users = require('./modules/users')
const tweets = require('./modules/tweets')
const { authenticated } = require('../middleware/auth')

router.use('/api/admin', admin)
router.use('/api/users', users)
router.use('/api/tweets', authenticated, tweets)

module.exports = router
