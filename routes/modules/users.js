const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const upload = require('../../middleware/multer')
// 取得使用者資料
router.get('/:id', userController.getUser)

module.exports = router
