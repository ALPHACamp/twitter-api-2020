const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const { authenticated, authenticatedUser } = require('../../middleware/auth')


// 註冊/登入
router.post('/api/users/signin', userController.signIn)
router.post('/api/users', userController.signUp)

// 修改個人頁面或設定
router.put('/api/users/:id', authenticated, authenticatedUser(), userController.putUser)

// 取得目前登入的使用者資料
router.get('/api/users/current_user', authenticated, userController.getCurrentUser)

// 取得指定使用者資料
router.get('/api/users/:id', authenticated, authenticatedUser(), userController.getUser)

module.exports = router
