const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')

// route : login
router.post('/login', userController.login)
router.post('/users', userController.register)

module.exports = router
