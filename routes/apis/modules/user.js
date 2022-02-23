const express = require('express')
const router = express.Router()
const userController = require('../../../controllers/apis/user-controller')

router.post('/', userController.signUp)
router.get('/:id', userController.getUser)

module.exports = router
