const express = require('express')
const router = express.Router()
const user = require('./modules/user')
<<<<<<< HEAD
const tweet = require('./modules/tweet')
=======
const admin = require('./modules/admin')
>>>>>>> master
const { apiErrorHandler } = require('../middleware/error-handler')

router.use('/admin', admin)
router.use('/users', user)
router.use('/tweets', tweet)
router.use('/', apiErrorHandler)
module.exports = router
