const express = require('express')
const router = express.Router()

const users = require('./api/users')
const admin = require('./api/admin')
const tweets = require('./api/tweets')
const followships = require('./api/followships')
const { checkIfUser, checkIfLoggedIn } = require('../utils/authenticator')

// Jackson
router.use('/api/users', users)

// Johnny
router.use('/api/admin', admin)
router.use('/api/tweets', checkIfLoggedIn, checkIfUser, tweets)
router.use('/api/followships', checkIfLoggedIn, checkIfUser, followships)

module.exports = router
