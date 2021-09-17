const express = require('express')
const router = express.Router()
const followshipController = require('../../controllers/followshipController')

// 新增 POST /followships
router.post('/', followshipController.addFollowing)

// 刪除 DETELE /followships/:followingId
router.delete('/:followingId', followshipController.removeFollowing)

module.exports = router
