const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const user = require('./modules/user')
const userController = require('../controllers/user-controller')
const adminController = require('../controllers/admin-controller')
const { errorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')

// no need to authenticate
router.post('/admin/login', adminController.login)
router.post('/users/login', userController.login)
router.post('/users', userController.signUp)

router.use('/admin', authenticated, authenticatedAdmin, admin)
router.use('/users', authenticated, user)

router.use('/', errorHandler)

module.exports = router
