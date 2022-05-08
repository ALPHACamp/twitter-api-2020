const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controller')

router.post('/users', userController.register)

module.exports = router
