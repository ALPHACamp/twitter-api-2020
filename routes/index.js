const express = require('express')
const router = express.Router()

const apis = require('./modules/apis')
// const { authenticated } = require('../middleware/auth')
const { errorHandler } = require('../middleware/error-handler')

router.use('/api', apis)
router.get('/', (req, res) => res.send('Hello World!'))
router.use('/', errorHandler)

module.exports = router
