const express = require('express')
const router = express.Router()


const { user, tweet, followship } = require('./modules')
const { apiErrorHandler } = require('../middleware/error-handler')
const { authenticatedUser } = require('../middleware/auth')
const followship = require('../models/followship')

router.use('/users', user)
router.use('/tweets', authenticatedUser, tweet)
router.use('/followships', authenticatedUser, followship)
router.use('/', apiErrorHandler)

module.exports = router
