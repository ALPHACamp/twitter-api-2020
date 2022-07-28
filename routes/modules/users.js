const express = require('express')
const router = express.Router()

const { authenticated, authUser } = require('../../middleware/auth')
const userController = require('../../controllers/user-controller')

router.post('/signin', userController.signin)
router.get('/:id', authenticated, authUser, userController.getUser)
router.post('/', userController.signup)

module.exports = router
