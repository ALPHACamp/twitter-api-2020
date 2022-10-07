const router = require('express').Router()
const adminRoute = require('./admin')
const { usersRoute, tweetsRoute, followshipsRoute } = require('./user')

router.use('/users', usersRoute)
router.use('/admin', adminRoute)
router.use('/tweets', tweetsRoute)
router.use('/followships', followshipsRoute)

module.exports = router
