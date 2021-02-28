const express = require('express')
const router = express.Router()

const users = require('./api/users')
const admin = require('./api/admin')
const tweets = require('./api/tweets')
const followships = require('./api/followships')

// Jackson
router.use('/api/users', users)

// Johnny
router.use('/api/admin', admin)
router.use('/api/tweets', tweets)
router.use('/api/followships', followships)

module.exports = router
