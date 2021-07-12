const express = require('express')
const router = express.Router()

const { authenticated, checkRole } = require('../middlewares/auth')

const admin = require('./modules/admin')
const followships = require('./modules/followships')
const tweets = require('./modules/tweets')
const users = require('./modules/users')

router.use('/api/admin', checkRole('Admin'), admin)
router.use('/api/followships', authenticated, followships)
router.use('/api/tweets', authenticated, tweets)
router.use('/api/users', users)

module.exports = router
