const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const userController = require('../controllers/userController.js')

// 登入
router.post('/api/users/signin', userController.signIn)
// 註冊
router.post('/api/users', userController.signUp)

module.exports = router