const router = require('express').Router()
const adminController = require('../../../controllers/apis/admin-controller')

// admin 登入
router.post('/users', adminController.adminLogin)

// 瀏覽所有users
router.get('/users', adminController.getUsers)
module.exports = router
