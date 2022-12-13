const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const { authenticated } = require('../../middleware/auth')

router.get('/:id', authenticated, userController.getUserProfile)
router.post('/', userController.signUp)
module.exports = router
