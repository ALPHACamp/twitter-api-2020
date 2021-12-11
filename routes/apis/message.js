// 載入所需套件
const express = require('express')
const router = express.Router()
const messageController = require('../../controllers/messageController')
const { authenticated, checkNotAdmin } = require('../../middlewares/auth')

router.get('/public', authenticated, checkNotAdmin, messageController.getPublicMessage)
router.get('/private/:id', authenticated, checkNotAdmin, messageController.getPrivateMessage)

// router exports
module.exports = router