const express = require('express')
const router = express.Router()

const apis = require('./modules/apis')
const { authenticated } = require('../middleware/auth')

router.use('/api', apis)
router.get('/', authenticated, (req, res) => res.send('Hello World!'))

module.exports = router
