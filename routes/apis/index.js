const express = require('express')
const router = express.Router()
const userController = require('../../controllers/apis/user-controllers')

router.post('users', userController.signin)

module.exports = router
