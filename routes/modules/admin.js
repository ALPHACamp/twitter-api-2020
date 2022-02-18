const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controllers')

router.get('/users', adminController.getUsers)

module.exports = router