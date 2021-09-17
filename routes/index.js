const router = require('express').Router()
const apis = require('./apis')

router.use('/api', apis)

module.exports = router
