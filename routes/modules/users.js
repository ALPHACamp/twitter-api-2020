const express = require('express')
const router = express.Router()

// const { authenticated, isUser } = require('../../middleware/auth')
const userController = require('../../controllers/user-controller')

router.post('/signin', userController.signin)
router.post('/', userController.signup)

module.exports = router
