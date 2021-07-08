const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/api/adminController')

router.get('/users', adminController.getUsers)

module.exports = router
