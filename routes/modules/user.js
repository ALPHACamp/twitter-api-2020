const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')

router.get('/:userId', userController.getUser)
router.get('/?top=', userController.getTopUsers)
router.get('/', userController.getUsers)

module.exports = router
