const express = require('express')
const router = express.Router()
const users = require('./user')
const admin = require('./admin')

router.use('/users', users)
router.use('/admin', admin)

module.exports = router
