const express = require('express')
const router = express.Router()

const userRoute = require('./userRoute')
const tweetRoute = require('./tweetRoute')
const adminRoute = require('./adminRoute')

router.use('/users', userRoute)
router.use('/tweets', tweetRoute)
router.use('/admin', adminRoute)

module.exports = router
