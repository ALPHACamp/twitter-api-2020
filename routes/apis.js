const express = require('express')
const router = express.Router()
const flash = require('connect-flash')

const userController = require('../controllers/api/userController.js')

router.post('/users', userController.signUp)
router.get('/logout', userController.logout)

// route: /api/users
router.get('/users/:id/edit', userController.editUser) // 帳戶設定
// router.get('users/:id/profile', userController.editUserProfile) // 編輯個人資料
// router.put('users/:id', userController.putEditUser) // 儲存帳戶設定
// router.put('users/:id/profile', userController.putUserProfile) // 儲存個人資料

module.exports = router
