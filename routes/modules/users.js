const express = require('express')
const router = express.Router()
const userController = require('../../controllers/userController')
const { authenticated } = require('../../middleware/auth')

router.post('/', userController.signUp)
router.post('/signin', userController.signIn)

router.use(authenticated)

module.exports = router
