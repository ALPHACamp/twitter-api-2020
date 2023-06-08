const router = require('express').Router()
const followshipController = require('../../controllers/followship-controller')

router.post('/', followshipController.postFollowship) // 追隨使用者
router.delete('/:followshipId', followshipController.deleteFollowship) // 刪除followship

module.exports = router
