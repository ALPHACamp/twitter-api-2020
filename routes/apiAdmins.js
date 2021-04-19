const express = require('express')
const router = express.Router()

const adminController = require('../controllers/adminController')

// routes : login
router.post('/login', adminController.login)

// authenticated & authenticatedAdmin
const passport = require('../config/passport')
const authenticated = passport.authenticate('jwt', { session: false })
const authenticatedAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.role === 'admin') {
      return next()
    }
    return res.json({ status: 'error', message: 'you don\'t have authority to login!' })
  } else {
    return res.json({ status: 'error', message: 'you don\'t have authority to login!' })
  }
}

// routes : after login
router.get('/users', authenticated, authenticatedAdmin, adminController.getUsers)

module.exports = router
