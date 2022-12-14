const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')

router.post('/', userController.addFollowing)
router.delete('/:userId', userController.removeFollowing)
router.get('/', userController.getTopUsers)

module.exports = router
