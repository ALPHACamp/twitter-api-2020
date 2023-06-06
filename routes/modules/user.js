const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')

// 查看使用者及其所有推文
router.get('/:id', userController.getUser)
module.exports = router
