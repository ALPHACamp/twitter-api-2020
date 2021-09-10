const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController.js')

// 前台 Login
router.post('/login', userController.logIn)

module.exports = router
