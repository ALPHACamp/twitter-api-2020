const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')
const { generalErrorHandler } = require('../middleware/error-handler')

// admin
router.use('/admin', admin)

router.get('/', (req, res) => res.send('user page success!'))

// handle error
router.use('/', generalErrorHandler)

module.exports = router
