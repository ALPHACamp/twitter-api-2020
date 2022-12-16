const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const {
  authenticatedUser,
  authenticated
} = require('../../middleware/api-auth')

// 登入不需要驗證登入狀態
router.post('/signin', userController.signIn)

router.get('/:id', authenticated, authenticatedUser, userController.getUser)

// 註冊不需要驗證登入狀態
router.post('/', userController.signUp)

module.exports = router
