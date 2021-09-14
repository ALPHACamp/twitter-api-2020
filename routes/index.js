const router = require('express').Router()
let apis = require('./apis')

router.use('/api', apis)

module.exports = router
