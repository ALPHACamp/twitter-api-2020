const express = require('express')
const router = express.Router()

const adminController = require('../controllers/adminController')

// login
router.post('/login', adminController.login)

const passport = require('../config/passport')
const authenticatedAdmin = (req, res, next) => {
  // check user role, must be admin
  if (req.user.role === 'admin') {
    return next()
  }
  return res.json({ status: 'error', message: 'you don\'t have authority to login!' })
}
const authenticated = passport.authenticate('jwt', { session: false })

// after login
router.get('/users', authenticated, authenticatedAdmin, adminController.getUsers)

module.exports = router
