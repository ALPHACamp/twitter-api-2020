const router = require('express').Router()

const admin = require('./modules/admin')
const users = require('./modules/users')
const tweet = require('./modules/tweet')
const followship = require('./modules/followship')

const { apiErrorHandler } = require('../middleware/error-handler')

router.use('/admin', admin)
router.use('/users', users)
router.use('/tweets', tweet)
router.use('/followships', followship)

// error handler
router.use('/', apiErrorHandler)

module.exports = router
