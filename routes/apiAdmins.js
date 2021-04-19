const express = require('express')
const router = express.Router()

const helpers = require('../_helpers')
const adminController = require('../controllers/adminController')

// route : login
router.post('/login', adminController.login)

// authenticated & authenticatedAdmin
const passport = require('../config/passport')
const authenticated = passport.authenticate('jwt', { session: false })
const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req)) {
    if (helpers.getUser(req).role === 'admin') {
      return next()
    }
    return res.json({ status: 'error', message: 'you don\'t have authority to login!' })
  } else {
    return res.json({ status: 'error', message: 'you don\'t have authority to login!' })
  }
}

// routes : after login
router.get('/users', authenticated, authenticatedAdmin, adminController.getUsers)
router.delete('/tweets/:id', authenticated, authenticatedAdmin, adminController.deleteTweet)

module.exports = router
