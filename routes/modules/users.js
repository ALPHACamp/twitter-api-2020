const express = require('express')
const router = express.Router()

const { authenticated, authenticatedAdmin } = require('../../middleware/auth')
const userController = require('../../controllers/user-controller')

router.post('/signin', userController.signin)
router.post('/', userController.signup)

module.exports = router
