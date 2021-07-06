const express = require('express')
const passport = require('passport')
const router = express.Router()
const authenticated = passport.authenticate('jwt', { session: false })
const adminController = require('../../controllers/adminController')

const authenticatedAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.role === 'admin') { return next() }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

// for testing: test if authenticated & authenticatedAdmin works
router.get('/users', authenticated, authenticatedAdmin, adminController.getUsers)

module.exports = router
