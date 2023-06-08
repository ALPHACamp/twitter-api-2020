const express = require('express')
const router = express.Router()
const userController = require('../controller/user-controller')

router.post('/api/users/signup', userController.signUp)

module.exports = router
