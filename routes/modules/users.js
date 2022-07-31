const express = require('express')
const router = express.Router()

const userController = require('../../controllers/user-controller')

router.get('/:id/likes', userController.getUserLikes)
router.get('/currentUser', userController.getCurrentUser)
router.get('/', userController.getUsers)

module.exports = router
