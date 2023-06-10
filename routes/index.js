const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')
const users = require('./modules/users')
const tweets = require('./modules/tweets')
const followships = require('./modules/followships')
const { apiErrorHandler } = require('../middleware/error-handler')

router.use('/api/admin', admin)
router.use('/api/users', users)
router.use('/api/tweets', tweets)
router.use('/api/followships', followships)

router.use('/', apiErrorHandler)
router.use('/', (req, res) => res.send('this is home page.')) // for testing

module.exports = router
