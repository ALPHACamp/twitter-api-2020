const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const userController = require('../controllers/user-controller')
{ authenticated, authenticatedAdmin, authenticatedUser } = require('../middleware/auth')

router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)

router.get('/users', userController.getCurrentUser)

router.use('/', (req, res) => {
  res.json('api test main')
})

module.exports = router
