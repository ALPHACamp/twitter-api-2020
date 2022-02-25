const express = require('express')
const router = express.Router()
const { authenticated, authenticatedUser } = require('../../middleware/auth')
const userController = require('../../controllers/user-controller')

router.get('/:userId', userController.getUser)


module.exports = router