const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controller')

router.post('/:id/like', userController.addLike)
router.post('/:id/unlike', userController.removeLike)

module.exports = router
