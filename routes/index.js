const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controller')

router.post('/signin', userController.signin)

module.exports = router
