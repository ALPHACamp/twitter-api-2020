const express = require('express')
const userController = require('../../controllers/api/userController')
const router = express.Router()



//register
router.post('/', userController.register)
//login
router.post('/login', userController.login)

module.exports = router
