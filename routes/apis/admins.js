// 載入所需套件
const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/adminController')

router.post('/signin', adminController.adminLogin)

// router exports
module.exports = router