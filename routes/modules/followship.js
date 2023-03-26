const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')

router.delete('/:followingId', userController.removeFollowing)
router.post('/', userController.addFollowing)

module.exports = router
