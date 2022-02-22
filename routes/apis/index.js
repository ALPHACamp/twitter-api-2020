const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')

router.use('/admin', admin)
router.use('/')

module.exports = router