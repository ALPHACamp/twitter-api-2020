//require needed modules 
const express = require('express')
const router = express.Router()
const { authenticated } = require('../middleware/auth')

//require routes modules
const admin = require('./modules/admin')
const users = require('./modules/users')

//use router
router.use('/admin', admin)
router.use('/users', users)

module.exports = router
