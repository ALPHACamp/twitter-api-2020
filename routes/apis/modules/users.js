const express = require('express')
const router = express.Router()
const userController = require('../../../controllers/user-controller')

router.post('/users', userController.signUp)
router.get('/users/:id', userController.getUser)


module.exports = router