const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const userController = require('../controllers/user-controller')
const adminController = require('../controllers/admin-controller')
const { authenticated, authenticatedAdmin, authenticatedUser} = require('../middleware/auth')
const { apiErrorHandler } = require('../middleware/error-handler')

router.post('/api/admin/login', adminController.signIn)
router.use('/api/admin', authenticated, authenticatedAdmin, admin)
router.post('/api/users/login', userController.signIn)

router.use('/', apiErrorHandler)

module.exports = router