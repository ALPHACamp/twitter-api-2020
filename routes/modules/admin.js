const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
// 管理者查看使用者清單
router.get('/users', adminController.getUsers)
module.exports = router
