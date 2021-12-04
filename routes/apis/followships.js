// 載入所需套件
const express = require('express')
const router = express.Router()
const followshipController = require('../../controllers/followshipController')
const { authenticated, checkNotAdmin } = require('../../middlewares/auth')

router.post('/', authenticated, checkNotAdmin, followshipController.postFollowship)
router.delete('/:followingId', authenticated, checkNotAdmin, followshipController.deleteFollowship)


// router exports
module.exports = router