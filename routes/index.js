const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const users = require('./modules/users')
const tweets = require('./modules/tweets')
const followships = require('./modules/followships')
const { authenticated, authenticatedRole } = require('../middlewares/auth')

router.use('/api/tweets', authenticated, authenticatedRole(), tweets)
router.use('/api/followships', authenticated, authenticatedRole(), followships)
router.use('/api/users', users)
router.use('/api/admin', admin)

module.exports = router
