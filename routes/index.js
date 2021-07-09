const express = require('express')
const router = express.Router()

const { authenticated } = require('../middlewares/auth')

const admin = require('./modules/admin')
const followships = require('./modules/followships')
const tweets = require('./modules/tweets')
const users = require('./modules/users')

// const { authenticator } = require('../middleware/auth')

router.use('/api/admin', admin)
router.use('/api/followships', followships)
router.use('/api/tweets', authenticated, tweets)
router.use('/api/users', users)

module.exports = router
