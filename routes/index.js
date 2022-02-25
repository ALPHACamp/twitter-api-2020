const express = require('express')
const router = express.Router()
const passport = ('../config/passport')

const userController = ('../controllers/user-controller')

router.post('/api/users/signin', passport.authenticate('local', {
  session: false
}), userController.signIn)
router.post('/api/users', userController.signUp)
module.exports = router
