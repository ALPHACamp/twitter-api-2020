//require needed modules 
const express = require('express')
const router = express.Router()
const { authenticated, authenticatedAdmin } = require('../middleware/api-auth')
const { generalErrorHandler} = require('../middleware/error-handler')

//require routes modules
const admin = require('./modules/admin')
const users = require('./modules/users')

//require controller
const userController = require('../controllers/user-controller')
const adminController = require('../controllers/admin-controller')

//use router
router.use('/api/admin', admin)
router.use('/api/users', users)

module.exports = router
