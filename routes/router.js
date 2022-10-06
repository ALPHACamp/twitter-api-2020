const router = require('express').Router()
const userRoute = require('./user')
const adminRoute = require('./admin')
const tweetsRoute = require('./user/tweets')
const followshipsRoute = require('./user/followships')

router.use('/users', userRoute)
router.use('/admin', adminRoute)
router.use('/tweets', tweetsRoute)
router.use('/followships', followshipsRoute)

module.exports = router
