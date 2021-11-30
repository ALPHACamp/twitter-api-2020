// 載入所需套件
const express = require('express')
const router = express.Router()
const userController = require('../../controllers/userController')

router.post('/', userController.signUp)

// router exports
module.exports = router