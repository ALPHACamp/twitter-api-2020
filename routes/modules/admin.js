const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/adminController')
const { authenticated } = require('../../middlewares/auth')

router.get('/users', authenticated, adminController.getUsers)

module.exports = router
