const express = require('express')
const router = express.Router()

const { authenticated, authenticatedAdmin } = require('../middleware/auth')

const userController = require('../controllers/userController.js')
const adminController = require('../controllers/adminController.js')

// 前台 Login
router.post('/login', userController.logIn)
// 註冊
router.post('/users', userController.register)

// 後台 Login
router.post('/adminLogin', adminController.adminLogIn)
// 後台：取得所有使用者資料
router.get(
  '/admin/users',
  authenticated,
  authenticatedAdmin,
  adminController.getAllUsers
)
// 後台：刪除單一 tweet
router.delete(
  '/admin/tweets/:id',
  authenticated,
  authenticatedAdmin,
  adminController.deleteTweet
)

module.exports = router
