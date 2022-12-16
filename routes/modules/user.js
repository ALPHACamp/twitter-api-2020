const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const { authenticated, authenticatedUser } = require('../../middleware/auth')

// 取得使用者資料
router.get('/:id', authenticated, authenticatedUser, userController.getUser)
module.exports = router
