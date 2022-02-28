const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const tweets = require('./modules/tweets')
const users = require('./modules/users')
const followships = require('./modules/followships')

router.use('/api/tweets', tweets)
router.use('/api/admin', admin)
router.use('/api/users', users)
router.use('/api/followships', followships)

module.exports = router
