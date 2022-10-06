const express = require('express')
const router = express.Router()
const { apiErrorHandler } = require('../../middleware/error-handler')
const { authenticated } = require('../../middleware/auth')
const adminController = require('../../controllers/admin-controller')

router.get('/users', adminController.getUsers)

router.use('/', apiErrorHandler)

module.exports = router
