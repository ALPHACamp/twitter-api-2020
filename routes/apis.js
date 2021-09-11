const express = require('express')
const router = express.Router()

const { authenticated, authenticatedAdmin } = require('../middleware/auth')

const userController = require('../controllers/userController.js')
const adminController = require('../controllers/adminController.js')

// 前台 Login
router.post('/login', userController.logIn)

// 後台 Login
router.post('/adminLogin', adminController.adminLogIn)

module.exports = router
