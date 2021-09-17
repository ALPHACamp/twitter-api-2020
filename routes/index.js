const express = require('express')
const passport = require('../config/passport')
const router = express.Router()
const admin = require('./modules/admin')
const helpers = require('../_helpers')
const users = require('./modules/users')
const tweets = require('./modules/tweets')
const followships = require('./modules/followships')
const { authenticated, checkRole } = require('../middleware/auth')

router.use('/api/users', users)
router.use('/api/admin', admin)

router.use('/api/tweets', authenticated, checkRole(), tweets)
router.use('/api/followships/', authenticated, checkRole(), followships)

module.exports = router
