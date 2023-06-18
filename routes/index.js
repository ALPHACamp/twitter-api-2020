const express = require('express')
const router = express.Router()
const user = require('./modules/user')
const tweet = require('./modules/tweet')
const admin = require('./modules/admin')
const followship = require('./modules/followship')
const { apiErrorHandler } = require('../middleware/error-handler')

router.use('/admin', admin)
router.use('/users', user)
router.use('/tweets', tweet)
router.use('/followships', followship)
router.use('/', apiErrorHandler)
module.exports = router
