const express = require('express')
const router = express.Router()
const followshipController = require('../../controllers/followship-controller')
router.post('/', followshipController.addFollowing) // 追蹤使用者
router.delete('/:followingId', followshipController.removeFollowing) // 取消追蹤
module.exports = router
