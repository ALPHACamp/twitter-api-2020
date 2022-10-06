const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')

router.post('/users/signin', userController.signIn)

module.exports = router