const express = require('express')
const router = express.Router()
const followshipController = require('../../controllers/followship-controller')
const { authenticated, authenticatedUser } = require('../../middleware/auth')

// 追蹤使用者
router.post('/', authenticated, authenticatedUser, followshipController.followUser)
// 取消追蹤使用者
router.delete('/:id', authenticated, authenticatedUser, followshipController.unfollowUser)

module.exports = router
