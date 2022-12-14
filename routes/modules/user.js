const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
router.put('/:userId', userController.editUser)
router.post('/following/:userId', userController.addFollowing)
router.delete('/following/:userId', userController.removeFollowing)
router.get('/followship', userController.getTopUsers)
router.get('/:userId', userController.getUser)
router.get('/', userController.getUsers)

module.exports = router
