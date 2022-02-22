const express = require('express')
const router = express.Router()
const { authenticated, blockRole } = require('../../helpers/auth')

const userController = require('../../controllers/user-controllers')

router.post('/login', userController.login)
router.get('/:id', authenticated, blockRole('admin'), userController.getUser)
router.post('/', userController.register)

module.exports = router
