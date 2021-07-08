const express = require('express')
const router = express.Router()
const userController = require('../../controllers/userController')
const { authenticated, authenticatedUser } = require('../../middleware/auth')

router.post('/', userController.signUp)
router.post('/signin', userController.signIn)

router.use(authenticated)
router.get('/current', userController.getCurrentUser)
router.get('/top', userController.getTopUsers)

router.put('/:id/account', userController.editAccount)
router.get('/:id', userController.getUser)
module.exports = router
