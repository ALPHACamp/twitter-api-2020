const express = require('express')
const router = express.Router()

const passport = require('../../config/passport')
const userController = require('../../controllers/user-controller')

router.post(
  '/signin',
  passport.authenticate('jwt', { session: false }),
  userController.signIn
)

router.get('/:id', userController.getUser)

router.post('/', userController.signUp)

module.exports = router
