const express = require('express')
const router = express.Router()
const userController = require('../../../controllers/user-controller')

router.post('/', userController.signUp)
router.post('/', userController.signIn)
// router.get('/users/:id', userController.getUser)

module.exports = router