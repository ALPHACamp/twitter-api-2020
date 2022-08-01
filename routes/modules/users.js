const express = require('express')
const router = express.Router()

const userController = require('../../controllers/user-controller')

router.get('/:id/followings', userController.getUserFollowing)
router.get('/:id/likes', userController.getUserLikes)
router.get('/currentUser', userController.getCurrentUser)
router.get('/:id', userController.getUser)
router.get('/', userController.getUsers)

module.exports = router
