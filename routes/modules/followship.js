const express = require('express')
const router = express.Router()
const followshipController = require('../../controllers/followship-controller')

// 新增followship
router.post('/', followshipController.addFollowing)
// 移除followship
router.delete('/:followingId', followshipController.removeFollowing)
// 搜尋累計follower總量前10名
// router.get('/top', followshipController.getTopUser)

module.exports = router
