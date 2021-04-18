const express = require('express')
const router = express.Router()

const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')

router.post('/login', userController.login)

router.get('/users', adminController.getUsers)

module.exports = router
