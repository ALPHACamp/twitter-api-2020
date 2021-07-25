const express = require('express')
const router = express.Router()

const { authenticated, checkNotRole } = require('../middlewares/auth')

const admin = require('./modules/admin')
const followships = require('./modules/followships')
const tweets = require('./modules/tweets')
const users = require('./modules/users')
const messages = require('./modules/messages')
const subscriptions = require('./modules/subscriptions')

router.use('/api/admin', authenticated, checkNotRole('user'), admin)
router.use('/api/followships', authenticated, checkNotRole('admin'), followships)
router.use('/api/tweets', authenticated, checkNotRole('admin'), tweets)
router.use('/api/users', users)
router.use('/api/messages', authenticated, checkNotRole('admin'), messages)
router.use('/api/subscriptions', authenticated, checkNotRole('admin'), subscriptions)

module.exports = router
