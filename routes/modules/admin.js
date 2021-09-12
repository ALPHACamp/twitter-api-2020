const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/adminController')
const { authenticated, authenticatedRole } = require('../../middlewares/auth')

router.get('/users', authenticated, authenticatedRole('admin'), adminController.getUsers)

module.exports = router
