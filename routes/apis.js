const express = require('express')
const router = express.Router()

const { authenticated, authenticatedAdmin } = require('../middleware/auth')

const userController = require('../controllers/userController.js')

// 前台 Login
router.post('/login', userController.logIn)
// 註冊
router.post('/users', userController.register)

module.exports = router
