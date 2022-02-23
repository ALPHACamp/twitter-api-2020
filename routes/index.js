const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const user = require('./modules/user')


router.use('/api/admin', admin)
router.use('/api/users', user)
router.use('/api/signin')


module.exports = router