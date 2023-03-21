const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controller')

router.post('/users', userController.signUp)

module.exports = router
