const express = require('express')
const router = express.Router()
const userController = require('../../controllers/userController')
const { authenticated, authenticatedRole } = require('../../middlewares/auth')

router.post('/signin', userController.signIn)
router.post('/', userController.postUser)
router.get('/current_user', authenticated, authenticatedRole(), userController.getCurrentUser)

module.exports = router
