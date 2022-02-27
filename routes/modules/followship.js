// 引入模組
const express = require('express')
const router = express.Router()
const followshipController = require('../../controllers/followship-controller')

// followship相關路由
router.delete('/:followingId', followshipController.deleteFollowUser)
router.post('/', followshipController.postFollowUser)

// 匯出模組
module.exports = router