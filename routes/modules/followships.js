const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')

router.post('/', userController.addFollowing)
router.delete('/:followingId', userController.removeFollowing)

module.exports = router
