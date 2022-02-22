const express = require('express')
const router = express.Router()
const { authenticated, blockRole } = require('../../helpers/auth')

const userController = require('../../controllers/user-controllers')

router.post('/login', userController.login)
<<<<<<< HEAD
router.get('/:id', authenticated, blockRole('admin'), userController.getUser)
=======
router.get(
  '/:id',
  authenticated,
  checkRoleInverse('admin'),
  userController.getUser
)
>>>>>>> origin/tweets
router.post('/', userController.register)

module.exports = router
