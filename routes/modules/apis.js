const express = require('express')
const router = express.Router()

const users = require('../modules/users')
const tweets = require('../modules/tweets')
const followships = require('../modules/followships')
const admin = require('../modules/admin')
const sign = require('../modules/sign')
const { authenticated, authenticatedAdmin } = require('../../middleware/auth')

router.use('/', sign)
router.use('/users', authenticated, users)
router.use('/tweets', authenticated, tweets)
router.use('/followships', authenticated, followships)
router.use('/admin', authenticated, authenticatedAdmin, admin)

module.exports = router
