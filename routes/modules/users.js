const express = require('express')
const router = express.Router()
const { registerValidator } = require('../../middleware/validator')
const userController = require('../../controllers/user-controller')

// 登入
router.post('/login', userController.login)
// 註冊
router.post('/', registerValidator, userController.register)

module.exports = router
