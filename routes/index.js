const express = require('express')
const router = express.Router()

const { authenticated, checkNotRole } = require('../middlewares/auth')

const admin = require('./modules/admin')
const followships = require('./modules/followships')
const tweets = require('./modules/tweets')
const users = require('./modules/users')
const messages = require('./modules/messages')

router.use('/api/admin', authenticated, checkNotRole('user'), admin)
router.use('/api/followships', authenticated, checkNotRole('admin'), followships)
router.use('/api/tweets', authenticated, checkNotRole('admin'), tweets)
router.use('/api/users', users)
router.use('/api/messages', authenticated, checkNotRole('user'), messages)

module.exports = router
