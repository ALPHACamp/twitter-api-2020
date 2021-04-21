const express = require('express')
const userController = require('../../controllers/userController')
const { authenticated, authenticatedUser } = require('../../middleware/authenticate')
const router = express.Router()

router.post('/login', userController.login)

router.use(authenticated, authenticatedUser)

module.exports = router
