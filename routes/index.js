const express = require('express')
const router = express.Router()

const users = require('./api/users')
const admin = require('./api/admin')
const tweets = require('./api/tweets')
const followships = require('./api/followships')
const { checkIfAdmin, checkIfLoggedIn } = require('../utils/authenticator')

// Jackson
router.use('/api/users', users)

// Johnny
router.use('/api/admin', checkIfLoggedIn, checkIfAdmin, admin)
router.use('/api/tweets', checkIfLoggedIn, tweets)
router.use('/api/followships', checkIfLoggedIn, followships)

module.exports = router
