const express = require('express')
const router = express.Router()
const userController = require('../../controllers/userController')
const { authenticated } = require('../../middlewares/auth')

router.post('/signin', userController.signIn)
router.get('/current_user', authenticated, userController.getCurrentUser)

module.exports = router
