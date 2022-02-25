const express = require('express')
const router = express.Router()
const passport = ('../config/passport')

const userController = ('../controllers/user-controller')

router.post('api/signin', passport.authenticate('local', {
  failureRedirect: '/signin',
  failureFlash: true
}), userController.signIn)

module.exports = router
