// 載入所需套件
const express = require('express')
const router = express.Router()
const userController = require('../../controllers/userController')
const { authenticated, checkNotAdmin } = require('../../middlewares/auth')

router.post('/', userController.signUp)
router.get('/:id', authenticated, checkNotAdmin, userController.getUser)

// router exports
module.exports = router