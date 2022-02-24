const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const userController = require('../../controllers/user-controller')
const { authenticated, authenticatedAdmin } = require('../../middleware/auth')


router.post(
  '/signin',
  passport.authenticate('local', { session: false }),
  userController.signin
)


module.exports = router