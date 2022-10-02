const express = require('express')
const router = express.Router()

const { generalErrorHandler } = require('../middleware/error-handler')

const admin = require('./modules/admin')
const followship = require('./modules/followship')
const tweet = require('./modules/tweet')
const user = require('./modules/user')

router.use('/api/followship', followship)
router.use('/api/tweets', tweet)
router.use('/api/admin', admin)
router.use('/api/users', user)
router.get('/', (req, res) => res.send('Hello World!'))
router.get('/error', generalErrorHandler)
module.exports = router
